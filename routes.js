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
    app.post('/api/basket/delete', (request, response) => {
        var id = request.body.id;

        for (let index = 0; index < myBasket.length; index++) {
            const element = myBasket[index];

            if (element.name === id) {
                console.log(myBasket, 'eudweudiweudiuwedwed');
                myBasket.indexOf(index);
                myBasket.splice(index, 1);
                console.log(myBasket, "product");
            }
        }


        response.send("deleting");
    });

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
                // asegurarnos de que no hay error

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

    //Filtros y orden
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
        var cantidad = [];
        var is = false;
        for (var i = 0; i < listCopy.length; i++) {
            price += listCopy[i].price;

        }

        //Encunentra cuales elementos son iguales
        var count = {};
        var clean = [];

        listCopy.forEach(function(i) {
            i = i._id.toString();
            count[i] = (count[i] || 0) + 1;
        });

        //hace la iteración de los ids
        Object.keys(count).forEach(key => {
            var obj = listCopy.find(elem => elem._id.toString() === key);
            obj.count = count[key];
            clean.push(obj);

        })



        const context = {
            products: clean,
            total: price,
            cant: count,


        }


        res.render('basket', context);

    });

    app.get('/checkout', function(req, res) {
        const products = db.collection('products');
        var query = {};


        res.render('checkout');



    });

    app.post('/checkout/orders', (request, response) => {

        const orders = db.collection('orders');
        console.log(request.body);
        orders.insertOne(request.body);

        response.send({ message: 'ok' });
    });





}
module.exports = createRoutes;