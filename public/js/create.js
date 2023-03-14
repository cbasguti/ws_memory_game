const params = new URLSearchParams(window.location.search);
const owner = params.get('owner');
const gameId = params.get('gameId');

let cardBack = 0;

$(document).ready(function () {
    console.log("OWNER FLAG => " + owner);
    console.log("gameID FLAG => " + gameId);

    if (owner == false) {
      $(".cards_select").css('display', 'none');
    } 

    $("#create_form").submit(function(event) {
        event.preventDefault(); // Evita que la página se recargue
        const nombreUsuario = $("#user_name").val();
        const temaCartas = $("#cards_theme").val();
        // Aquí debes agregar tu lógica para crear el juego
        // ...
        // Después de crear el juego, redirige a otra sección de la página


        if (owner === 'true') {
          // console.log('IF => ' + owner);
          window.location.href = "/partida?create=true&username=" + nombreUsuario + "&cardBack=" + temaCartas;
        } else {
          // console.log('ELSE => ' + owner);
          window.location.href = "/partida?join=true&gameId=" + gameId + "&username=" + nombreUsuario;
        }
      });
});