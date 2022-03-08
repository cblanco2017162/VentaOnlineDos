const express = require('express');
const categoriaControlador = require('../controllers/categoria.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarCategoria', [md_autenticacion.Auth, md_roles.varAdmin], categoriaControlador.agregarCategoria);
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.varAdmin], categoriaControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria', [md_autenticacion.Auth, md_roles.varAdmin], categoriaControlador.eliminarCategoria);
api.get('/buscarCategoria', [md_autenticacion.Auth, md_roles.varAdmin], categoriaControlador.obtenerCategorias);

module.exports = api;