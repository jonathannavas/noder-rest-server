const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

/*===========================================
         OBTENER TODOS LOS PRODUCTOS
============================================*/
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    //populate : usuario y categoria
    //paginado
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });

});

/*===========================================
        OBTENER UN PRODUCTO POR ID
============================================*/
app.get('/producto/:id', verificaToken, (req, res) => {


    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                producto: productoDB
            });
        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');

});

/*===========================================
        BUSCAR PRODUCTOS POR PARAMETROS
============================================*/

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;

    //expresiones regulares
    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        });


});


/*===========================================
            CREAR UN NUEVO PRODUCTO
============================================*/
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});


/*===========================================
        ACTUALIZAR UN PRODUCTO POR ID
============================================*/
app.put('/producto/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    let body = req.body;


    let detallesProducto = {

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
            //usuario: req.usuario._id

    }

    Producto.findByIdAndUpdate(id, detallesProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });



});


/*===========================================
            ELIMINAR UN PRODUCTO
============================================*/
app.delete('/producto/:id', verificaToken, (req, res) => {
    //dar de baja por el estado de true a false

    let id = req.params.id;

    let cambiarEstadoProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiarEstadoProducto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto dado de baja exitosamente'
        });

    });

});

module.exports = app;