const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = Schema({
    descripcion: String,
    idAdmin: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);