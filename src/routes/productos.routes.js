const express = require('express');
const controladorProductos = require('../controllers/productos.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.agregarProducto);
api.put('/editarProducto/:idProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.editarProducto);
api.delete('/eliminarProducto/:idProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.eliminarProductos);
api.get('/buscarProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.obtenerProductos);
api.get('/buscarPorNombre/:nombreProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.obtenerProductoNombre)

module.exports = api;