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
        productoModelo.idCategoria = req.user.sub;

                categoriaModelo.save({ idCategoria : usuario }).populate('idCategoria', 'nombre')
                              .exec((err, productoGuardado) => {
                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                 if(!productoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

                               return res.status(200).send({ producto: productoGuardado });
                                })
                          }
}

function editarProducto(req, res){
    var idProd = req.params.idProducto;
    var parametros = req.body;    

     Productos.findOneAndUpdate({_id : idProd, idCategoria : req.user.sub}, parametros, {new : true}, (err, empleadoActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!empleadoActualizado) return res.status(500)
                .send({ mensaje: 'No puede editar productos de otra categoria'});
            
            return res.status(200).send({ empleado : empleadoActualizado })
        });
}

function eliminarProductos(req, res){
    var idProd = req.params.idProducto;

     Productos.findOneAndDelete({_id : idProd, idCategoria : req.user.sub}, (err, productoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoEliminado) return res.status(404).send( { mensaje: 'No puede eliminar productos de otra categoria'});

        return res.status(200).send({ producto: productoEliminado});
    })
}

function obtenerProductos(req, res){
    Productos.find({idCategoria : req.user.sub}, (err, productosEncontrados) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < productosEncontrados.length; i++) {
            console.log(productosEncontrados[i].nombre)
        }

        return res.send({ Productos: productosEncontrados })
    }) 
}

function obtenerProductoNombre(req, res){
    var nombreProd = req.params.nombreProducto;

    Empleado.findOne( { nombre : { $regex: nombreProd, $options: 'i' }, idCategoria : req.user.sub }, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, ese producto no existe o no perteneces a esa categoria" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProductos,
    obtenerProductos,
    obtenerProductoNombre
}