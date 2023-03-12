$(document).ready(function () {

    $("#btnCreate").on("click", function () {
        window.location.href = "/partida?create=true";
    });

    $("#btnJoin").on("click", function () {
        let gameId = $('#token_input').val();
        window.location.href = "/partida?join=true&gameId=" + gameId;
    });

});