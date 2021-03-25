import express from 'express';
import Note from '../models/note';
import { verifyAuth, verifyRol } from '../middlewares/authentication';
const router = express.Router();

// POST. route through which notes are added
router.post('/new-note', verifyAuth, async (req, res) => {
    const body = req.body;
    body.uid = req.user._id;

    try {
        const noteDB = await Note.create(body);
        // Contar documentos
        const totalNotes = await Note.find({ uid: body.uid }).countDocuments();
        res.status(200).json({ noteDB, totalNotes }); // El status 200 viene por defecto: no es necesario
    } catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

// GET. get a note with parameters (id)
router.get('/note/:id', async (req, res) => {
    const _id = req.params.id; // Hay recordar que en MongoDB el id es un parametro precedido por guion bajo ("_")

    try {
        const noteaDB = await Note.findOne({ _id });
        res.json(noteaDB); // No es necesario el status 200
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

// GET. get all documents or notes
/* router.get('/notes', verifyAuth, async (req, res) => {
    const uid = req.user._id;
    try {
        const notesDB = await Note.find({ uid }); // Filtra la DB por "uid"
        res.json(notesDB);
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
}); */

// GET. get documents(notes) with pagination
router.get('/notes', verifyAuth, async (req, res) => {
    const uid = req.user._id;
    const limit = Number(req.query.limit) || 5; // Default es 5 (con operador cortocircuito)
    const skip = Number(req.query.skip) || 0; // Por defecto empieza en el primer documeto
    try {
        const notesDB = await Note.find({ uid }).limit(limit).skip(skip); // Filtra la DB por "uid"
        // Contar documentos
        const totalNotes = await Note.find({ uid }).countDocuments();
        res.json({ notesDB, totalNotes });
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

// DELETE. delete a note with the given id 
router.delete('/note/:id', verifyAuth, async (req, res) => {
    const _id = req.params.id;

    try {
        const noteDB = await Note.findByIdAndDelete({ _id });
        // Contar documentos
        const totalNotes = await Note.find({ uid: req.user._id }).countDocuments();
        res.json({ noteDB, totalNotes });
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

// PUT. upadate a note with the given id 
router.put('/note/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        const noteDB = await Note.findByIdAndUpdate(_id, body, { new: true });
        res.json(noteDB);
    } catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error',
            error
        });
    }
});

module.exports = router;