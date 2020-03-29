'use strinct'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

//recupera el modelo
var Article = require('../models/article');

var controller = {
    //ruta  o metodo de prueba para el API REST

    health: (req, res) => {
        return res.status(200).send({
            message: 'OK'
        });

    },


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
    },

    getArticle: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id;
        console.log("getArticle " + articleId);

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos'
                });
            }
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req, res) => {
        //recoger el id del articulo por la url
        var articleId = req.params.id;

        //recoger los datos por put
        var params = req.body;

        console.log(params);

        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //find and update
            Article.findOneAndUpdate({
                    _id: articleId
                }, params, {
                    new: true
                },
                (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar'
                        });
                    }

                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });

                });
        } else {
            //devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    delete: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id;

        //find and delete
        Article.findOneAndDelete({
            _id: articleId
        }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },

    upload: (req, res) => {
        //configurar el modulo de connect multiparty router/article.js (hecho)

        //recoger el fichero de la petición
        var file_name = 'Imagen no subida ...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //conseguir el nombre y la extension
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // *ADVERTENCIA * EN LINUX o MAC
        // var file_split = file_path.split('/');

        //nombre del archivo
        var file_name = file_split[2];

        //extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //comprobar la extension, solo imagenes, si no es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: "La extensión de la imagen no es valida"
                });
            });
        } else {
            //obtengo el id de la url
            var articleId = req.params.id;

            //buscar el articulo, asignrle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({
                _id: articleId
            }, {
                image: file_name
            }, {
                new: true
            }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: "Error al guardar la imagen del articulo"
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }

    }, // end upload file


    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    }, //end get image
    search: (req, res) => {
        //obtener el string a buscar
        var searchString = req.params.search;

        //find or
        Article.find({
                "$or": [{
                        "title": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },
                    {
                        "content": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },

                ]
            }).sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    }

}; //end controller

module.exports = controller;