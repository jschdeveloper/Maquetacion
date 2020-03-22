'use strinct'

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

    }
}; //end controller

module.exports = controller;