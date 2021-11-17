const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
   
    nombre: {
        type: String,
        required: true
    },
   email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    estado: { //para desactivar en caso de eliminar
        type: Boolean,
        default: true //por defecto cuando se cree va a quedar activo
    },
    
});

module.exports = mongoose.model('Usuario', usuarioSchema);