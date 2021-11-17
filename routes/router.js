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

router.get('/:id', async (req, res) => {
    const book = await client.getOne(req.params.id)
    res.json({
        message: 'LIBRO EN ESPECIFICO',
        data: book
    })
})

router.post('/new', async (req, res) => {
    const book = await client.create(req.body);
    
    res.json({
        message: 'LIBRO CREADO CON ÉXITO',
        data: book
    })
})

router.patch('/:id', (req, res) => {
    res.send("ACTUALIZAR LIBRO");
})

router.patch('/:id/progress', async (req, res) => {
    const TotalPaginas = await client.getCantidadPaginas(req.params.id);
    const newBookProgress = await client.updateProgress(req.params.id, req.body.newActual, TotalPaginas[0].paginas);

    if (newBookProgress) {
        
        res.json({
            message: 'PROGRESO ACTUALIZADO CON ÉXITO',
            data: newBookProgress
        })

    } else {
        res.send("ESTE LIBRO NO TIENE EL ESTADO LEYENDO");
    }
})

router.patch('/:id/status', async (req, res) => {

    const updatedStatusBook = await client.updateStatus(req.params.id, req.body)

    res.json({
        message: 'ESTADO ACTUALIZADO CON ÉXITO',
        data: updatedStatusBook
    })
})

router.delete('/:id', async (req, res) => {
    
    const deleted = await client.delete(req.params.id);

    res.json({
        message: 'LIBRO ELIMINADO CON ÉXITO',
        data: deleted
    })
})

module.exports = router;