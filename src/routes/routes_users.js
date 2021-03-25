import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'underscore'; // Para filtrar campos de PUT
import { verifyAuth, verifyRol } from '../middlewares/authentication';
const router = express.Router();
const saltRounds = 10;

// POST. route through which users are added
router.post('/new-user', async (req, res) => {
    const body = {
        name: req.body.name,
        email: req.body.email,
        pass: bcrypt.hashSync(req.body.pass, saltRounds),
        avatar: req.body.avatar,
        role: req.body.role,
    };

    try {
        const userDB = await User.create(body);

        // Generar token
        const token = jwt.sign({
            data: userDB // No tiene el password porque asi lo configuramos en el schema
        }, 'secret', { expiresIn: 60 }); // Expira en una hora. (60 * 60 * 24 * 30)

        res.status(200).json({ userDB, token }); // El status 200 viene por defecto: no es necesario
    } catch (error) {
        res.status(500).json({
            message: 'Ya existe el email en la Base de Datos. Ingresa otro valor.',
            error
        });
    }
});

// PUT. upadate a note with the given id 
router.put('/user/:id', [verifyAuth, verifyRol], async (req, res) => {
    const _id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'pass', 'active']); // No permite modificar el rol

    if (body.pass) body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try { // Devuelve el usuario actualizado (al poner "new: true")
        const userDB = await User.findByIdAndUpdate(_id, body, {
            new: true,
            runValidators: true,
            context: 'query' // Permite actualizar el email si es "unique"
        });
        res.json(userDB);
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

module.exports = router;

// ERROR AL USAR LA LIBRERIA DE VALIDACION 'mongoose-unique-validator':
// https://es.stackoverflow.com/questions/345025/mongoose-unique-validator-message-cannot-read-property-ownerdocument-of-nu