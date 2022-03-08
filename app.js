const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuarios.routes');
const CategoriaRutas = require('./src/routes/categoria.routes');
const ProductosRutas = require('./src/routes/productos.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, CategoriaRutas, ProductosRutas);

module.exports = app;