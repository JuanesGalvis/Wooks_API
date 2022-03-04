const express = require('express');
const RouterUsers = express.Router();

const MongoDB = require('../database/client');
const client = new MongoDB();

const JWT = require('jsonwebtoken');

const Passport = require('passport');

RouterUsers.post('/new_user', async (request, response) => {

  const User = await client.getUser(request.body.email);

  if (User) {

    response.json({ message: 'USUARIO YA SE ENCUENTRA REGISTRADO' });

  } else {

    let result = await client.insertUser(request.body);
    response.json({ result, message: 'USUARIO INSERTADO CON ÉXITO' });

  }
});

RouterUsers.get('/user', async (request, response) => {
  let result = await client.getUser(request.body.email);
  response.json({ message: 'EL USUARIO EXISTE' });
});

RouterUsers.post('/login', async (request, response) => {
  let User = await client.getUser(request.body.email);

  if (User) {
    const payload = {
      sub: User["_id"],
      owner: User.name
    }
    const token = JWT.sign(payload, process.env.JWT_SECRET);
    const result = { User, token }

    response.json({ result, message: 'USUARIO INDICADO' });
  } else {
    response.json({ message: 'ESTE USUARIO NO SE ENCUENTRA REGISTRADO' });
  }

});

RouterUsers.put('/users/:userId',
  Passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    let result = await client.updateUser(request.params.userId, request.body);
    response.json({ result, message: 'USUARIO ACTUALIZADO' });
  });

RouterUsers.delete('/users/:userId',
  Passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    let result = await client.deleteUser(request.params.userId);
    response.json({ result, message: 'USUARIO ELIMINADO' });
  });

/** AMIGOS */

RouterUsers.post('/request_friend',
  Passport.authenticate('jwt', { session: false }),
  async (request, response) => {

    let result = await client.requestFriend(request.user.sub, request.body.friendId);
    response.json({ result, message: 'SOLICITUD DE AMISTAD ENVIADA' });

  })

RouterUsers.post('/add_friend',
  Passport.authenticate('jwt', { session: false }),
  async (request, response) => {

    let result = await client.addFriend(request.user.sub, request.body.friendId);
    response.json({ result, message: 'AGREGADOS COMO AMIGOS' });

  })

RouterUsers.get('/friends',
  Passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    let result = await client.getUserFriends(request.user.sub);
    response.json({result,  message: 'USUARIO Y SUS AMIGOS' });
  });

module.exports = RouterUsers;