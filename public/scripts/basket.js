window.addEventListener('load', function() {

    var removeProduct__btn = document.querySelectorAll('.trash__btn');

    removeProduct__btn.forEach(function(btn) {

        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var id = btn.getAttribute('data-name');

            var promise = fetch('/api/basket/:id' + id, { method: 'POST' });
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