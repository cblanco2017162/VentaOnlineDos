const Usuario = require('../models/usuarios.model');
const Producto = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const usuariosModel = require('../models/usuarios.model');

function RegistrarAdmin(req, res) {
    var usuarioModel = new Usuario();

            usuarioModel.nombre = 'ADMIN';
            usuarioModel.apellido = 'ADMIN'
            usuarioModel.email = 'ADMIN';
            usuarioModel.password = '123456'
            usuarioModel.rol = 'ADMIN';
            usuarioModel.imagen = null;

            Usuario.find({ email : 'ADMIN'}, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else{
                    console.log('El usuario de administrador ya existe');
                }
            })
}

function RegistrarCliente(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if(parametros.nombre && parametros.apellido && 
        parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.apellido = parametros.apellido;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'CLIENTE';
            usuarioModel.imagen = null;

            Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }     
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;    

 Usuario.findOne({_id:idUser},(err,usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: "Error, el usuario no existe. Verifique el ID"});
            if(!usuarioEncontrado) return res.status(404).send({mensaje: "Error, el usuario no existe. Verifique el ID"})    
   
            if(usuarioEncontrado.rol == 'CLIENTE'){
            Usuario.findByIdAndUpdate(idUser, parametros, {new : true},
              (err, usuarioActualizado)=>{
              if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
              if(!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario'});
            
             return res.status(200).send({usuario : usuarioActualizado})
        })
    }else{
        return res.status(500).send({ mensaje: "No puede editar los administradores" });
      }
    })
}

function EliminarUsuario(req, res){
     var idUser = req.params.idUsuario;
     Usuario.findOne({_id:idUser},(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error, el usuario no existe. Verifique el ID"});
        if(!usuarioEncontrado) return res.status(404).send({mensaje: "Error, el usuario no existe. Verifique el ID"})
 
        if(usuarioEncontrado.rol == "CLIENTE"){
         Usuario.findByIdAndDelete(idUser,(err,usuarioEliminado)=>{
                   if(err) return res.status(500).send({mensaje: "Error, el usuario no existe"});
                   if(!usuarioEliminado) return res.status(404).send({mensaje: "Error, el usuario no existe"})
           
                   return  res.status(200).send({usuario:usuarioEliminado});
               })
     }else{
          return res.status(500).send({ mensaje: 'No puede eliminar administradores'});
     }
    })
}


module.exports = {
    RegistrarAdmin,
    RegistrarCliente,
    Login,
    EditarUsuario, 
    EliminarUsuario
}