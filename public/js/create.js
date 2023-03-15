const params = new URLSearchParams(window.location.search);
const owner = params.get('owner');
const gameId = params.get('gameId');

let cardBack = 0;

$(document).ready(function () {
  
    if (owner !== 'true') {
      $(".cards_select").css('display', 'none');
    } 

    $("#create_form").submit(function(event) {
        event.preventDefault(); // Evita que la página se recargue
        const nombreUsuario = $("#user_name").val();
        const temaCartas = $("#cards_theme").val();

        if (owner === 'true') {
          window.location.href = "/partida?create=true&username=" + nombreUsuario + "&cardBack=" + temaCartas;
        } else {
          window.location.href = "/partida?join=true&gameId=" + gameId + "&username=" + nombreUsuario;
        }
      });
});