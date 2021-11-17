const express = require('express'); // se instancia express
const Servicio = require ('../models/servicio_model');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router(); //creamos una instancia de ruta


ruta.get('/', verificarToken, (req,res) => { //establecemos la ruta raíz de GET
    let resultado = listarServiciosActivos();
    resultado.then(servicios => {
        res.json(servicios);
    }).catch(err => {
        res.status(400).json(err);
    })
});

ruta.post('/', verificarToken, (req, res) => {
    let resultado = crearServicio(req.body); //resultado es la promesa, el doc grabado

    resultado.then(servicio => { //user = estado 200 ok
        res.json({
            servicio
        })
    }).catch(err => { //manejo del error (promesa)
        res.status(400).json({
            err
        })
    });
});

ruta.put('/:nombre', verificarToken, (req,res) => {
    let resultado = actualizarServicio(req.params.nombre, req. body);
    resultado.then(servicio => { //promesa
        res.json(servicio)
    }).catch(err => {
        res.status(400).json({
            err
        })
    })
});

ruta.delete('/:id', verificarToken,(req, res) => {
    let resultado = desactivarServicio(req.params.id);
    resultado.then(servicio => {
        res.json(servicio);
    }).catch(err => {
        res.status(400).json(err);
    })
});

async function listarServiciosActivos(){
    let servicios = await Servicio.find({"estado": true});
    return servicios;
};

async function crearServicio(body){
    let servicio = new Servicio({ //servicio es la objeto del modelo Servicio y se instancia en new Servicio, pasándole los datos
        categoria   : body.categoria,
        nombre      : body.nombre,
        comuna      : body.comuna
    });
    return await servicio.save(); //para guardar el dato en la bbdd
}

async function actualizarServicio(id, body){ //nombre es por el cual voy a buscar al usuario
    let servicio = await Servicio.findByIdAndUpdate(id, { //que busque y que actualice por el id
        $set: { //acá le paso los parámetros que quiero actualizar 
            categoria: body.categoria,
            comuna: body.comuna
        }
    }, {new: true});
    return servicio;
}

async function desactivarServicio(id){
    let servicio = await Servicio.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, {new: true});
    return servicio;
}

module.exports = ruta;