$(document).ready(function () {

    $("#btnCreate").on("click", function () {
        // window.location.href = "/partida?create=true";
        window.location.href = "/crear-juego?owner=true";
    });

    $("#btnJoin").on("click", function () {
        let gameId = $('#token_input').val();
        // window.location.href = "/partida?join=true&gameId=" + gameId;
        window.location.href = "/crear-juego?owner=false&gameId=" + gameId;
    });

});