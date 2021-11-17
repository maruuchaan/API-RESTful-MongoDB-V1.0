const jwt = require('jsonwebtoken');
const config = require('config');

let verificarToken = (req, res, next) =>{
    let token = req.get('Authorization'); //Authorization es la variable que está en el header del método get de usuarios donde va el token
    jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
        if (err) {
            return res.status(401).json({
                err
            })
        }
        req.usuario = decoded.usuario;
        next()
    });

}

module.exports = verificarToken;