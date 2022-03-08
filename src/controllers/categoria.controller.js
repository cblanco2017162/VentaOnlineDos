const Categoria = require('../models/cotegoria.model');

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

function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;

     Categoria.findOneAndDelete({_id : idCategoria, idAdmin : req.user.sub}, (err, categoriaEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!categoriaEliminada) return res.status(404).send( { mensaje: 'No puede eliminar categorias creadas por otro admin'});

        return res.status(200).send({ categoria: categoriaEliminada});
    })
}

function obtenerCategorias(req, res){
    Categoria.find((err, categoriaEncontrada) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < categoriaEncontrada.length; i++) {
            console.log(categoriaEncontrada[i].nombre)
        }

        return res.send({ Categorias: categoriaEncontrada })
    }) 
}

module.exports = {
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias
}