const jwt = require('jsonwebtoken');
//============================
//      VERIFICAR TOKEN
//===========================
let verificaToken = (req, res, next) => {


    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "El token no es valido"
                }
            })
        }

        req.usuario = decoded.usuario;

        next();
    });

};
//============================
//   VERIFICAR ROLE ADMIN
//===========================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }


};

//==================================
//    CREAR TOKEN POR URL IMAGEN
//==================================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "El token no es valido"
                }
            })
        }

        req.usuario = decoded.usuario;

        next();
    });



}
module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};