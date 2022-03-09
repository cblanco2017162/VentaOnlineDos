const Productos = require('../models/productos.model');

function agregarProducto(req, res){
    var parametros = req.body;
    var productoModelo = new Productos;
    var usuario = req.user.sub;

    if( parametros.nombre && parametros.cantidad && parametros.vendido &&
        parametros.precio) {
        productoModelo.nombre = parametros.nombre;
        productoModelo.cantidad = parametros.cantidad;
        productoModelo.vendido = parametros.vendido;
        productoModelo.precio = parametros.precio;
        productoModelo.idCategoria = parametros.idCategoria;

                productoModelo.save({ idCategoria : usuario } ,(err, productoGuardado) => {
                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                 if(!productoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

                               return res.status(200).send({ producto: productoGuardado });
                                })
                          }
}

function editarProducto(req, res){
    var idProd = req.params.idProducto;
    var parametros = req.body;    

     Productos.findOneAndUpdate(idProd, parametros, {new : true}, (err, productoActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!productoActualizado) return res.status(500)
                .send({ mensaje: 'No puede editar productos de otra categoria'});
            
            return res.status(200).send({ Producto : productoActualizado })
        });
}

function eliminarProductos(req, res){
    var idProd = req.params.idProducto;

     Productos.findOneAndDelete(idProd, (err, productoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoEliminado) return res.status(404).send( { mensaje: 'No puede eliminar productos de otra categoria'});

        return res.status(200).send({ Eliminado: productoEliminado});
    })
}

function obtenerProductos(req, res){
    Productos.find((err, productosEncontrados) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < productosEncontrados.length; i++) {
            console.log(productosEncontrados[i].nombre)
        }

        return res.send({ Productos: productosEncontrados })
    }) 
}

function obtenerProductoNombre(req, res){
    var nombreProd = req.params.nombreProducto;

    Productos.findOne( { nombre : { $regex: nombreProd, $options: 'i' }}, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, ese producto no existe" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

function Stock(req, res){
    const idProd = req.params.idProducto;
    const parametros = req.body;
    
    Productos.findOne({_id: idProd}, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, ese producto no existe" });
    
    if(parametros.cantidad >= productoEncontrado.cantidad){
    Productos.findByIdAndUpdate(idProd, {$inc : {cantidad: parametros.cantidad}}, {new: true},(err, productoModificado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoModificado) return res.status(404).send({ mensaje: "Error al editar el producto" });

        return res.status(200).send({ producto: productoModificado });
    })
   }else{
    return res.status(500).send({ mensaje: "La cantidad restada es mayor a la existencia del producto" });
   }
 })
}

function productoMasVendido(req, res){

}

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProductos,
    obtenerProductos,
    obtenerProductoNombre,
    Stock
}