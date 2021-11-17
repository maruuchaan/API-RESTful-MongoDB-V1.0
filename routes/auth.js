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
                const Token = jwt.sign({
                    usuario: {_id: datos._id, nombre: datos.nombre, email: datos.email}
                  }, config.get('configToken.SEED'), { expiresIn:config.get('configToken.expiration')});
                // const Token = jwt.sign({_id: datos.id, nombre: datos.nombre, email: datos.email}, 'password')//sign es lo que genera el payload
                // res.send(Token); //esta es otra forma de enviar el token pero sin condición de expiración
                res.json({
                    usuario:{
                        _id             :datos._id,
                        nombre          :datos.nombre,
                        email           :datos.email
                    },
                    Token
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