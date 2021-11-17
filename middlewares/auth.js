const jwt = require('jsonwebtoken');
const config = require('config');


//función para verificar el token
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token,config.get('configToken.SEED'),(err,decoded) =>{ //verify pide el param `secret', por eso se pone lo de SEED// decoded trae la data del usuario decodificada en el payload del token
        if(err){
            return res.status(401).json({
                err
            })
        }
        //res.send(token); me devuelve el token, pero necesito el usuario que viene en el payload, y eso viene en el parámetro decoded
        req.usuario = decoded.usuario; //usuario tiene todos los datos que se le pasaron al token
        next() //si no se coloca la siguiente función no se ejecuta
    })
};
module.exports = verificarToken;