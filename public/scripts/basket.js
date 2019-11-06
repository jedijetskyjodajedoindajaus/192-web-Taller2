window.addEventListener('load', function() {

    var removeProduct__btn = document.querySelectorAll('.trash__btn');

    removeProduct__btn.forEach(function(btn) {

        btn.addEventListener('click', function(event) {
            //event.preventDefault();
            var id = btn.getAttribute('data-name');

            //sconsole.log(id, 'deleteando')

            fetch(`/api/basket/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${id}`,
            }).then(function(respuesta) {
                return respuesta.text();
            }).catch(function(error) {
                console.error(error);
            }).then(function(mensaje) {
                console.log(mensaje);
            });

        });

    });

});