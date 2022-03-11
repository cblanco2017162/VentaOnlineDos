const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarritosSchema = Schema({
    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number,
        subTotal : Number,
    }],
    totalCarrito: Number,
    idCliente: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Carritos', CarritosSchema);