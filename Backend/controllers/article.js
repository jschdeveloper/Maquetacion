'use strinct'

var validator = require('validator');
//recupera el modelo
var Article = require('../models/article');

var controller = {
    //ruta  o metodo de prueba para el API REST
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Mastar en frameworks JS',
            autor: 'Victor Robles web',
            url: 'victorroblesweb.es',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });

    },

    save: (req, res) => {
        //Recoger parametros por post
        var params = req.body;

        //validar datos(validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });
        }

        if (validate_title && validate_content) {
            //Crear el objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;


            //Guardar el artículo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });


            });
            //devolver una respuesta           
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },
    getArticles: (req, res) => {
        var query = Article.find({});
        
        var last = req.params.last;
        
        console.log(last);

        if (last || last != undefined) {
            query.limit(5);
        }

        //find
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        //


    }
}; //end controller

module.exports = controller;