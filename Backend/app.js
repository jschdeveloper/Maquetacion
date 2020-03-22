'use strinct'

//Cargar modulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//ejecutar express (http)
var app = express();

//cargar ficheros rutas
var article_routes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// CORS

// Añadir prefijos a rutas / cargar rutas
app.use('/api', article_routes);

//ruta  o metodo de prueba para el API REST

// Exportar el modulo  (fichero actual) 
module.exports = app;