window.addEventListener('load', function() {

    var addChart__btn = document.querySelectorAll('.product__addcart');
    var addChart__responsive = document.querySelectorAll('.product__addcart--responsive');

    var shopping__counter = document.querySelector('.shopping__counter');

    addChart__btn.forEach(function(btn) {

        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var id = btn.getAttribute('data-name');
            console.log("helow madafaka")

            var promise = fetch('/api/cart/' + id, { method: 'POST' });
            promise
                .then(function(response) {
                    console.log(response);
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);
                    shopping__counter.innerText = data.cartLength;
                });

        });

    });

    addChart__responsive.forEach(function(btn) {

        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var id = btn.getAttribute('data-name');
            console.log("helow madafaka")

            var promise = fetch('/api/cart/' + id, { method: 'POST' });
            promise
                .then(function(response) {
                    console.log(response);
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);
                    shopping__counter.innerText = data.cartLength;
                });

        });

    });

});