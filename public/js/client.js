$(document).ready(function () {

    $("#btnCreate").on("click", function () {
        window.location.href = "/crear-juego?owner=true";
    });

    $("#join_form").submit(function (event) {
        event.preventDefault(); // Evita que la página se recargue
        let gameId = $("#token_input").val();

        // Validar si el campo está vacío
        if (gameId.trim() === "") {
            alert("El código de juego no puede estar vacío.");
            return;
        }

        window.location.href = "/crear-juego?owner=false&gameId=" + gameId;
    });

});