const express = require('express');
const controladorProductos = require('../controllers/productos.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.agregarProducto);
api.put('/editarProducto/:idProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.editarProducto);
api.delete('/eliminarProducto/:idProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.eliminarProductos);
api.get('/buscarProductos', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.obtenerProductos);
api.get('/buscarPorNombre/:nombreProducto', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.obtenerProductoNombre);
api.post('/agregarCarrito', [md_autenticacion.Auth, md_roles.varCliente], controladorProductos.agregarCarrito);
api.put('/llenarCarrito/:idCarrito', [md_autenticacion.Auth, md_roles.varCliente], controladorProductos.llenarCarrito);
api.put('/generarFactura/:idCarrito', [md_autenticacion.Auth, md_roles.varCliente], controladorProductos.generarFactura);
api.delete('/eliminarCarrito/:idCarrito',[md_autenticacion.Auth, md_roles.varCliente], controladorProductos.eliminarCarrito);
api.delete('/eliminarFactura/:idFactura', [md_autenticacion.Auth, md_roles.varCliente], controladorProductos.eliminarFactura);
api.get('/productosVendidos', [md_autenticacion.Auth, md_roles.varAdmin], controladorProductos.productosVendidos);

module.exports = api;