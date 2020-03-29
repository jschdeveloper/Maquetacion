'use strinct'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);
router.get('/health', ArticleController.health);

//rutas útiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);

module.exports = router;