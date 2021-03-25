import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const saltRounds = 10;

router.post('/login', async(req, res) => {

    const body = req.body;
    try {
        // Evaluando Email
        const userDB = await User.findOne({ email: body.email });
        if (!userDB) { // Si el email no ha sido encontrado en la DB
            return res.status(400).json({
                message: 'Credenciales inválidas' // Email no encontrado
            }); // para no dar informacion a usuario maliciosos
        };

        // Evaluando Password
        if(!bcrypt.compareSync(body.pass, userDB.pass)) { // Si la comparacion del pass que enviamos y la contraseña encriptada que viene de la DB no coinciden
            return res.status(400).json({
                message: 'Credenciales inválidas' // Contraseña incorrecta
            }); // para no dar informacion a usuario maliciosos
        };

        // Generar token
        const token = jwt.sign({
            data: userDB // No tiene el password porque asi lo configuramos en el schema
        }, 'secret', { expiresIn: 60 * 60 }); // Expira en una hora. (60 * 60 * 24 * 30)

        // Ahora si devolvemos la respuesta
        res.status(200).json({ // El status 200 viene por defecto: no es necesario
            userDB,
            token
        });
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

module.exports = router;
