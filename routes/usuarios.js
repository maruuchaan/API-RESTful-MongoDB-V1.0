const express = require('express'); // se instancia express
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
const Joi = require('joi');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router(); //creamos una instancia de ruta

const schema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'cl'] } }),

});

ruta.get('/', verificarToken, (req, res) => { //establecemos la ruta raíz de GET
    let resultado = listarUsuariosActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    });

});

ruta.post('/', (req, res) => {

    let body = req.body; //el request del cliente = body

    Usuario.findOne({ email: body.email }, (err, user) => {
        //error interno (servidor no responde, por ejemplo)            
        if (err) {
            return res.status(400).json({
                error: 'Server error'
            });
        }
        if (user) {
            return res.status(400).json({
                msj: 'El usuario ya existe'
            });
        } else {
            const { error, value } = schema.validate({ nombre: body.nombre, email: body.email });
            if (!error) {
                let resultado = crearUsuario(body); //resultado es la promesa, el doc grabado

                resultado.then(user => { //user = estado 200 ok
                    res.json({
                        nombre         : user.nombre,
                        email          : user.email
                    })
                }).catch(err => { //manejo del error (promesa)
                    res.status(400).json({
                        error: err
                    })
                });
            } else {
                res.status(400).json({
                    error: error
                })
            };
        };
    }
)});

    ruta.put('/:email',verificarToken, (req, res) => {//se actualizará buscando al usuario por el email
        //validar el nombre que se desea actualizar
        const { error, value } = schema.validate({ nombre: req.body.nombre });
        if (!error) {
            let resultado = actualizarUsuario(req.params.email, req.body)
            resultado.then(valor => {
                res.json({
                    nombre: valor.nombre,
                    email: valor.email
                })
            }).catch(err => {
                res.status(400).json({
                    error: err
                })
            });
        } else {
            res.status(400).json({
                error: error
            })
        }
    });

    ruta.delete('/:email',verificarToken, (req, res) => {
        let resultado = desactivarUsuario(req.params.email)
        resultado.then(valor => {
            res.json({
                nombre: valor.nombre,
                email: valor.email
            })
        }).catch(err => {
            res.status(400).json({
                error: err
            })
        })
    });

    async function listarUsuariosActivos() {
        let usuarios = await Usuario.find({ "estado": true })
            .select({ nombre: 1, email: 1 }); //.select para seleccionar qué usuarios mostrar ({ob:cant, ob:cant})
        return usuarios;
    };

    async function crearUsuario(body) {
        let usuario = new Usuario({ //usuario es el objeto del modelo Usuario y se instancia en new Usuario, pasándole los datos
            nombre         :    body.nombre,
            email          :    body.email,
            password       :    bcrypt.hashSync(body.password,10) //el 10 indica el núm de salts que se le agregan a la contraseña hasheada
        });
        return await usuario.save(); //para guardar el dato en la bbdd
    };

    async function actualizarUsuario(email, body) { //email es por el cual voy a buscar al usuario, body porque son los datos que voy a actualizar
        let usuario = await Usuario.findOneAndUpdate({ "email": email }, { //que busque y que actualice por el email {"email" : email} le paso el objeto email y que actualice cuando el objeto sea igual a email
            $set: { //acá le paso los parámetros que quiero actualizar
                nombre          :    body.nombre,
                password        :    body.password
            }
        }, { new: true });
        return usuario;
    };

    async function desactivarUsuario(email) {
        let usuario = await Usuario.findOneAndUpdate({ "email": email }, { //que busque y que desactive por el email {"email" : email} le paso el objeto email y que actualice cuando el objeto sea igual a email
            estado: false
        }, { new: true });
        return usuario;
    };

    module.exports = ruta;