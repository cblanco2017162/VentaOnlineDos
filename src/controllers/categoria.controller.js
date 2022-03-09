const Categoria = require('../models/cotegoria.model');
const Productos = require('../models/productos.model');

function agregarCategoria(req, res){
    var parametros = req.body;
    var categoriaModelo = new Categoria;

    if( parametros.descripcion) {
        categoriaModelo.descripcion = parametros.descripcion;
        categoriaModelo.idAdmin = req.user.sub;

                categoriaModelo.save((err, categoriaGuardada) => {
                      if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                      if(!categoriaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

                return res.status(200).send({ categoria: categoriaGuardada });
       })
   }
}

function editarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var parametros = req.body;    

     Categoria.findOneAndUpdate({_id : idCategoria, idAdmin : req.user.sub}, parametros, {new : true}, (err, categoriaActalizada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!categoriaActalizada) return res.status(500).send({ mensaje: 'No puede editar categorias creadas por otro admin'});
            
            return res.status(200).send({ categoria : categoriaActalizada })
        });
}

/*function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;

     Categoria.findOneAndDelete({_id : idCategoria, idAdmin : req.user.sub}, (err, categoriaEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!categoriaEliminada) return res.status(404).send( { mensaje: 'No puede eliminar categorias creadas por otro admin'});

        return res.status(200).send({ categoria: categoriaEliminada});
    })
}*/

function obtenerCategorias(req, res){
    Categoria.find((err, categoriaEncontrada) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < categoriaEncontrada.length; i++) {
            console.log(categoriaEncontrada[i].nombre)
        }

        return res.send({ Categorias: categoriaEncontrada })
    }) 
}

function eliminarCategoria(req, res){
    const categoriaId = req.params.idCategoria;

    Categoria.findOne({ _id: categoriaId, idAdmin: req.user.sub }, (err, categoriaAdmin) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!categoriaAdmin) return res.status(404).send( { mensaje: 'No puede editar categorias creadas por otra persona'});
    
        Categoria.findOne({descripcion: 'Por defecto'}, (err, categoriaEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!categoriaEncontrada){
                const modeloCategoria = new Categoria();
                modeloCategoria.descripcion = 'Por defecto';
                modeloCategoria.idAdmin = null;

                modeloCategoria.save((err, categoriaGuardada)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error al guardar categoria'});
                    if(!categoriaGuardada) return res.status(404).send( { mensaje: 'No se ha podido crear la categoria'});

                    Productos.updateMany({ idCategoria: categoriaId }, { idCategoria: categoriaGuardada._id },(err, productosActualizados)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la peticion al actualizar categoria'});

                        Categoria.findByIdAndDelete(categoriaId, (err, categoriaEliminada) =>{
                            if(err) return res.status(500).send({ mensaje: 'Error en la peticion al eliminar categoria'});
                            if(!categoriaEliminada) return res.status(404).send( { mensaje: 'No se ha podido eliminar la categoria'});

                            return res.status(200).send({ 
                                editado: productosActualizados,
                                eliminado: categoriaEliminada });
                        })
                    })
                })
            }else{
                Productos.updateMany({idCategoria: categoriaId}, { idCategoria: categoriaEncontrada}, (err, productosActualizados)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error al actualizar los productos'});

                    Categoria.findByIdAndDelete(categoriaId, (err, categoriaEliminada) =>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la peticion al eliminar categoria'});
                        return res.status(200).send({
                            editado: productosActualizados,
                            eliminado: categoriaEliminada
                        });
                    })
                })
            }
        })
    })
}

module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias
}