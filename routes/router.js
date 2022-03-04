const express = require('express');
const router = express.Router();

const MongoDB = require('../database/client');
const client = new MongoDB();

const Passport = require('passport');

router.get('/',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const books = await client.getAll(req.user.sub);

        res.json({
            message: 'TODOS LOS LIBROS',
            data: books
        })
    })

router.get('/:id',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const book = await client.getOne(req.params.id, req.user.sub)
        res.json({
            message: 'LIBRO EN ESPECIFICO',
            data: book
        })
    })

router.post('/new',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const book = await client.create(req.body, req.user.sub);

        res.json({
            message: 'LIBRO CREADO CON ÉXITO',
            data: book
        })
    })

router.patch('/:id',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const changeBook = await client.updateBook(req.params.id, req.body, req.user.sub);

        res.json({
            message: 'LIBRO ACTUALIZADO CON ÉXITO',
            data: changeBook
        })
    })

router.patch('/:id/progress',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const TotalPaginas = await client.getCantidadPaginas(req.params.id, req.user.sub);
        const newBookProgress = await client.updateProgress(req.params.id, req.body.newActual, TotalPaginas[0].paginas, req.user.sub);

        if (newBookProgress) {

            res.json({
                message: 'PROGRESO ACTUALIZADO CON ÉXITO',
                data: newBookProgress
            })

        } else {
            res.send("ESTE LIBRO NO TIENE EL ESTADO LEYENDO");
        }
    })

router.patch('/:id/status',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const updatedStatusBook = await client.updateStatus(req.params.id, req.body, req.user.sub)

        res.json({
            message: 'ESTADO ACTUALIZADO CON ÉXITO',
            data: updatedStatusBook
        })
    })

router.delete('/:id',
    Passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        const deleted = await client.delete(req.params.id, req.user.sub);

        res.json({
            message: 'LIBRO ELIMINADO CON ÉXITO',
            data: deleted
        })
    })

module.exports = router;