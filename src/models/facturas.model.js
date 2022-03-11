const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    listaComprado: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number
    }],
    totalFactura: Number
});

module.exports = mongoose.model('Factura', FacturaSchema);