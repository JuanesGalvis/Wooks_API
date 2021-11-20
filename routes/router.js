const express = require('express');
const router = express.Router();

const MongoDB = require('../database/client');
const client = new MongoDB();

router.get('/', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {
        
        const books = await client.getAll();
        
        res.json({
            message: 'TODOS LOS LIBROS',
            data: books
        })
        
    } else {
        
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }

})

router.get('/:id', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {
    
        const book = await client.getOne(req.params.id)
        res.json({
            message: 'LIBRO EN ESPECIFICO',
            data: book
        })
    
    } else {
        
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }

})

router.post('/new', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {

        const book = await client.create(req.body);
        
        res.json({
            message: 'LIBRO CREADO CON ÉXITO',
            data: book
        })

    } else {
            
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }
})

router.patch('/:id', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {

        const changeBook = await client.updateBook(req.params.id, req.body);

        res.json({
            message: 'LIBRO ACTUALIZADO CON ÉXITO',
            data: changeBook
        })

    } else {
            
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }
})

router.patch('/:id/progress', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {

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
    
    } else {
            
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }
})

router.patch('/:id/status', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {

        const updatedStatusBook = await client.updateStatus(req.params.id, req.body)

        res.json({
            message: 'ESTADO ACTUALIZADO CON ÉXITO',
            data: updatedStatusBook
        })

    } else {
            
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }
})

router.delete('/:id', async (req, res) => {

    if (req.headers.password === process.env.PASSWORD) {
    
        const deleted = await client.delete(req.params.id);

        res.json({
            message: 'LIBRO ELIMINADO CON ÉXITO',
            data: deleted
        })

    } else {
            
        res.json({
            message: 'SE DEBE INGRESAR LA CONTRASEÑA PARA USAR ESTA API',
        })

    }
})

module.exports = router;