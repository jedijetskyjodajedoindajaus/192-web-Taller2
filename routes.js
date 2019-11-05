const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

var myBasket = [];

function createRoutes(app, db) {

    app.get('/', (request, response) => {
        console.log('Alguien entró a la ruta inicial');
        response.sendFile(__dirname + '/public/index.html');
    });

    // app.get('/tiendass', (request, response) => {
    //     console.log('Alguien entró a la tienda');
    //     response.render('store');
    // });
    app.post('/api/cart/:id', (request, response) => {
        var id = request.params.id;
        const products = db.collection('products');
        var query = {};

        var esId = false;
        products.find({})
            // transformamos el cursor a un arreglo
            .toArray((err, result) => {
                // asegurarnos de que no hay error

                //

                var c = 0;
                var cont = 0;
                for (c; c < result.length; c++) {
                    if (request.params.id.toString() === result[c]._id.toString()) {
                        esId = true;
                        myBasket.push(result[c]);

                        cont += 1;
                    }
                }

                if (!esId) {
                    response.send({
                        message: 'error',
                        cartLength: myBasket.length
                    });
                    return;
                }


                console.log("myBasket[0]");
                response.send({
                    cartLength: myBasket.length
                });

            });



    });

    //BUSCO UN PRODUCTO EN BASE A SU ID EN LA BASE DE DATOS Y CARGO EL HANDLEBARS CON SU INFORMACION 
    app.get('/product/:id', function(req, res) {
        const products = db.collection('products');
        var query = {};
        products.find({})
            // transformamos el cursor a un arreglo
            .toArray((err, result) => {
                // asegurarnos de que noh ay error

                //
                var c = 0;
                for (c; c < result.length; c++) {
                    if (req.params.id.toString() === result[c]._id.toString()) {
                        result[c].cartLength = myBasket.length,
                            res.render('product', result[c]);
                    }
                }

            });

    });

    app.get('/tienda', (request, response) => {
        const products = db.collection('products');
        console.log('Alguien entró a la tienda');

        //buscamos todos los productos
        products.find({})
            //transformamos el cursor a una arreglo
            .toArray((err, result) => {
                //aseguramos de que no hay error
                assert.equal(null, err);
                var listCopy = result.slice();

                if (request.query.filter == 'cook') {
                    listCopy = listCopy.filter(function(elem) {
                        if (elem.skill == "Cook") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }

                if (request.query.filter == 'babysitter') {
                    listCopy = listCopy.filter(function(elem) {
                        if (elem.skill == "Babysitter") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }

                if (request.query.filter == 'clean') {
                    listCopy = listCopy.filter(function(elem) {
                        if (elem.skill == "Clean") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }


                if (request.query.order == 'cheap') {
                    listCopy.sort(function(a, b) {
                        return a.price - b.price;
                    });
                }

                if (request.query.order == 'expensive') {
                    listCopy.sort(function(a, b) {
                        return b.price - a.price;
                    });
                }

                if (request.query.order == 'thin') {
                    listCopy.sort(function(a, b) {
                        return a.weight - b.weight;
                    });
                }

                if (request.query.order == 'heavy') {
                    listCopy.sort(function(a, b) {
                        return b.weight - a.weight;
                    });
                }

                if (request.query.order == 'small') {
                    listCopy.sort(function(a, b) {
                        return a.size - b.size;
                    });
                }

                if (request.query.order == 'tall') {
                    listCopy.sort(function(a, b) {
                        return b.size - a.size;
                    });
                }

                var context = {
                    products: listCopy
                };

                response.render('store', context);
            });
    });

    app.get('/basket', function(req, res) {

        var listCopy = myBasket.slice();
        var price = 0;
        var cantidad = 0;
        for (var i = 0; i < listCopy.length; i++) {
            price += listCopy[i].price;

        }

        for (var i = 0; i < listCopy.length; i++) {

            console.log(listCopy[i]._id.toString());
            if (listCopy[i + 1] != null) {
                if (listCopy[i]._id.toString() === listCopy[i + 1]._id.toString()) {
                    cantidad += 1;
                    console.log(cantidad);
                }
            }
        }

        const context = {
            products: listCopy,
            total: price,
            cant: cantidad,


        }


        res.render('basket', context);

    });





}
module.exports = createRoutes;