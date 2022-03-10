const Productos = require('../models/productos.model');
const Carrito = require('../models/carrito.model');
const Factura = require('../models/facturas.model');

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

/*function Stock(req, res){
    const idProd = req.params.idProducto;
    const parametros = req.body;
    
    Carrito.findOne({_id: idProd}, (err, carritoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!carritoEncontrado) return res.status(404).send({ mensaje: "Error, ese carrito no existe" });
    
    if(parametros.cantidad < carritoEncontrado.cantidadComprada){
    Productos.findByIdAndUpdate(idProd, {$inc : {cantidad: parametros.cantidad}}, {new: true},(err, productoModificado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoModificado) return res.status(404).send({ mensaje: "Error al editar el producto" });

        return res.status(200).send({ producto: productoModificado });
    })
   }else{
    return res.status(500).send({ mensaje: "La cantidad restada es mayor a la existencia del producto" });
   }
 })
}*/

function productoMasVendido(req, res){

}

function agregarCarrito(req, res){
    var carritoModelo = new Carrito;
    var usuario = req.user.sub;

        carritoModelo.totalCarrito = 0;
        carritoModelo.subTotal = 0;
        carritoModelo.idCliente = req.user.sub;

                carritoModelo.save({ idCliente : usuario } ,(err, carritoGuardado) => {
                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                 if(!carritoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

                               return res.status(200).send({ Carrito: carritoGuardado });
                                })
                          
}

function llenarCarrito(req, res){
    const idCarrito = req.params.idCarrito;
    const parametros = req.body;

    Productos.findOne({nombre: parametros.nombreProducto }, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error al encontrar el producto" });
        
      if(parametros.cantidadComprada > productoEncontrado.cantidad){  
      Carrito.findByIdAndUpdate({_id: idCarrito, idCliente: req.user.sub}, { $push: { carrito: { nombreProducto: parametros.nombreProducto,
        cantidadComprada: parametros.cantidad, precioUnitario: productoEncontrado.precio}}},{new: true},
        (err, carritoActualizado)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion del cliente" });
            if(!carritoActualizado) return res.status(404).send({ mensaje: "Error al actualizar el carrito" });

            let totalLocal = 0;
            let subTotalLocal = 0;
            for(let i =0; i < carritoActualizado.carrito.length; i++){
                subTotalLocal = totalLocal + carritoActualizado.carrito[i].precioUnitario * carritoActualizado.carrito[i].cantidadComprada;
                totalLocal += totalLocal + subTotalLocal;
            }
            Carrito.findByIdAndUpdate({_id: idCarrito, idCliente: req.user.sub}, {totalCarrito: totalLocal, subTotal: subTotalLocal}, {new: true},(err, totalAgregado)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion del total" });
                if(!totalAgregado) return res.status(404).send({ mensaje: "Error al actualizar el total del carrito" }); 
           
                return res.status(200).send({ carrito: totalAgregado });
            })
        })
      } else{
          return res.status(200).send({ mensaje: "La cantidad comprada es mayor al stock del producto" });
      }
    })
}

function eliminarCarrito(req, res){
    var idCarrito = req.params.idCarrito;

     Carrito.findOneAndDelete({_id : idCarrito, idCliente : req.user.sub}, (err, carritoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!carritoEliminado) return res.status(404).send( { mensaje: 'No puede eliminar carritos de otros clientes'});

        return res.status(200).send({ carrito: carritoEliminado});
    })
}


function generarFactura(req, res){
    const facturaModel = new Factura();
    const idCarrito = req.parans.idCarrito
    var parametros = req.body;
    
    Carrito.findById(idCarrito, (err, carritoEncontrado)=>{
        facturaModel.listaComprado = carritoEncontrado.carrito;
        facturaModel.nit = parametros.nit;
        facturaModel.idUsuario = req.user.sub;
        facturaModel.totalFactura = carritoEncontrado.totalCarrito;

        for(let i = 0; i < carritoEncontrado.carrito.length; i++){
            Carrito.findOne((err, carritoBuscado)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if(!carritoBuscado) return res.status(404).send({ mensaje: "Error, ese carrito no existe" });
            
            if(parametros.cantidad < carritoBuscado.cantidadComprada){
            Productos.findOneAndUpdate({nombre: carritoEncontrado.carrito[i].nombreProducto}, {$inc : {cantidad: carritoEncontrado.cantidad[i].cantidadComprada*-1}}
                ,{new: true},(err, productoModificado)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if(!productoModificado) return res.status(404).send({ mensaje: "Error al editar el producto" });
        
                return res.status(200).send({ producto: productoModificado });
            })
           }else{
            return res.status(500).send({ mensaje: "La cantidad restada es mayor a la existencia del producto" });
           }
         })
        }
    })

    Carrito.findByIdAndUpdate({_id: idCarrito}, {$set:{carrito: [] }, totalCarrito:0},{new : true}, (err, carritoVacio)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion del cliente" });
        if(!carritoActualizado) return res.status(404).send({ mensaje: "Error al vaciar el carrito" });

        return res.status(200).send({Carrito: carritoVacio});
    })
}

/*Carrito.findOne((err, carritoBuscado)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if(!carritoBuscado) return res.status(404).send({ mensaje: "Error, ese carrito no existe" });

if(parametros.cantidad < carritoBuscado.cantidadComprada){}
})*/

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProductos,
    obtenerProductos,
    obtenerProductoNombre,
    agregarCarrito,
    llenarCarrito,
    eliminarCarrito,
    generarFactura
}