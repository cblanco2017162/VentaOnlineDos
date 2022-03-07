const mongoose = require('mongoose');
const app = require('./app');
Usuario = require('./src/controllers/usuarios.controller');

mongoose.Promise = global.Promise;                                                                  //function (){}
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Hola, esta corriendo en el puerto 3000!")
    })

    Usuario.RegistrarAdmin();

}).catch(error => console.log(error));