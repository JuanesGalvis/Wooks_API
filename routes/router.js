const express = require('express');
const router = express.Router();

const MongoDB = require('../database/client');
const client = new MongoDB();

router.get('/', async (req, res) => {
    const books = await client.getAll();
    res.json({
        message: 'TODOS LOS LIBROS',
        data: books
    })
})

router.get('/:id', (req, res) => {
    res.send("UN LIBRO EN ESPECIFICO");
})

router.post('/new', (req, res) => {
    res.send("CREAR LIBRO");
})

router.patch('/:id', (req, res) => {
    res.send("ACTUALIZAR LIBRO");
})

router.patch('/:id/progress', (req, res) => {
    res.send("ACTUALIZAR PROGRESO LIBRO");
})

router.patch('/:id/status', (req, res) => {
    res.send("ACTUALIZAR ESTADO LIBRO");
})

router.delete('/:id', (req, res) => {
    res.send("ELIMINAR LIBRO");
})

module.exports = router;