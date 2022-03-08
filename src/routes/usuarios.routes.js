const express = require('express');
const usuarioControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/login', usuarioControlador.Login);
api.post('/registrarCliente', usuarioControlador.RegistrarCliente);
api.put('/editarUsuario/:idUsuario',  [md_autenticacion.Auth, md_roles.varAdmin], usuarioControlador.EditarUsuario);
api.put('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuarioControlador.EliminarUsuario);

module.exports = api;