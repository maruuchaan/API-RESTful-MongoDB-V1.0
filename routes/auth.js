const express = require('express'); // se instancia express
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
// const Joi = require('joi');
const ruta = express.Router(); //creamos una instancia de ruta

//validación email y password
ruta.post('/', (req,res) => {
    Usuario.findOne({email: req.body.email})
        .then(datos => {
            if(datos){
                const passwordValido = bcrypt.compareSync(req.body.password, datos.password); //compara el password del require con el password que obtenemos de la bbdd a través de findOne
                if(!passwordValido) return res.status(400).json({error: 'ok', msj: 'Usuario o contraseña incorrecta'});
                
                //Generar Token
                const jwToken = jwt.sign({ //sign es lo que genera el payload
                    data: {_id: datos._id, nombre: datos.nombre, email: datos.email}
                }, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')});
                res.json({
                    usuario: {
                        _id     : datos._id,
                        nombre  : datos.nombre,
                        email   : datos.email
                    },
                    jwToken
                });
            }else{
                res.status(400).json({
                    error:'ok',
                    msj: 'Usuario o contraseña incorrecta'
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                error: 'ok',
                msj: 'Error en el servicio' + err
            })
        })
}
);

module.exports = ruta;