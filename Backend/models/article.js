'use strinct'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {
        type: Date,
        default: Data.now
    },
    image: String
});


//la colección es Article y se utiliza el ArticleSchema 
module.exports = mongoose.model('Article', ArticleSchema);
// articles --> guarda documentos de este tipo y con esta estructura dentro de la colección