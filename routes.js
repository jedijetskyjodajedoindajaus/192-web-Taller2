const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

var cartList = [];

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
                // asegurarnos de que noh ay error

                //

                var c = 0;
                var cont = 0;
                for (c; c < result.length; c++) {
                    if (request.params.id.toString() === result[c]._id.toString()) {
                        esId = true;
                        cartList.push(result[c]);

                        cont += 1;
                    }
                }

                if (!esId) {
                    response.send({
                        message: 'error',
                        cartLength: cartList.length
                    });
                    return;
                }


                console.log("cartList[0]");
                response.send({
                    cartLength: cartList.length
                });

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
                        if (elem.skill === "Cook") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }

                if (request.query.filter == 'babysitter') {
                    listCopy = listCopy.filter(function(elem) {
                        if (elem.skill === "Babysitter") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }

                if (request.query.filter == 'clean') {
                    listCopy = listCopy.filter(function(elem) {
                        if (elem.skill === "Clean") {
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
}
module.exports = createRoutes;