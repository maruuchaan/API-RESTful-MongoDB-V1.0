const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    comuna: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Servicio', servicioSchema);