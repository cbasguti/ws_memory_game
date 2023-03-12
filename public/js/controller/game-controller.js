// Declaracion de constantes
const params = new URLSearchParams(window.location.search);
const create = params.get('create');
const join = params.get('join');
const joinId = params.get('gameId');

// Declaracion de variables
let clientId = null;
let gameId = null;
let pathArray = null;
let yourTurn = null;
let ws = new WebSocket("ws://localhost:9090");
var clicks = 0;
var languages = [];
var cards = [];
var puntaje = 0;
var gameSet = false;

/* < ---- Declaracion de Funciones ---- >*/

// Crear las tarjetas
function crearTarjetas(pathArray) {
    // Seleccionar el contenedor de tarjetas
    const cardContainer = $(".card_container");

    // Definir el número de tarjetas a crear
    const numCards = 24;

    // Crear las tarjetas
    for (let i = 0; i < numCards; i++) {
        // Crear el elemento de la tarjeta
        const card = $("<div>").addClass("card_item sin_voltear");
        const imgClass = pathArray[i].split("/").pop().replace(".png", "");

        // Crear el elemento de la parte delantera
        const front = $("<div>").addClass("card_front");
        const frontImg = $("<img>").addClass("card-img").addClass(imgClass).attr("src", "/img/cardback3.png").attr("alt", "Card image cap").attr("value", i);
        front.append(frontImg);

        // Crear el elemento de la parte trasera
        const back = $("<div>").addClass("card_back");
        const backImg = $("<img>").addClass("card-img").addClass(imgClass).attr("src", pathArray[i]).attr("alt", "Card image cap");
        back.append(backImg);

        // Agregar la parte delantera y trasera a la tarjeta y agregar la tarjeta al contenedor
        card.append(front).append(back);
        cardContainer.append(card);
    }
}

// Funcion para poder jugar
function ableToPlay() {
    $('.sin_voltear').click(function () {
        if (!$(this).hasClass('volteada')) {
            clicks += 1;
            voltearCarta($(this));
            let card = $(this).children('.card_front').find('img').attr('value');
            let language = $(this).find('.card_back').find('.card-img').attr('class').split(' ').pop();
            languages.push(language);

            let payLoad = {
                "method": "one-click",
                "clientId": clientId,
                "gameId": gameId,
                "card": card
            }
            ws.send(JSON.stringify(payLoad));

            if (clicks >= 2) {

                let iguales = languages.every(function (element) {
                    return element === languages[0];
                });

                cartasDiferentes(iguales);

                if (!iguales) {
                    // Acabo su turno
                    console.log("-- Your Turn is Over --");
                    console.log("With userId: " + clientId.substring(0, 5));
                    console.log("< -------------------------- >");
                } else {
                    puntaje += 100;
                }

                let payLoad = {
                    "method": "played",
                    "clientId": clientId,
                    "gameId": gameId,
                    "sameCards": iguales,
                    "points": puntaje,
                    "playedBy": clientId
                }
                ws.send(JSON.stringify(payLoad));

                clicks = 0;
                languages = [];
            }
        }
    });
}

function voltearCarta(carta) {
    carta.toggleClass('flipped');
    carta.removeClass('sin_voltear');
    carta.addClass('volteada');
}

function cartasDiferentes(iguales) {
    setTimeout(function () {
        if (!iguales) {
            $('.volteada').each(function () {
                $(this).toggleClass('flipped');
                $(this).removeClass('volteada');
                $(this).addClass('sin_voltear');
            });
        } else {
            $('.volteada').each(function () {
                $(this).removeClass('volteada');
            });
        }
    }, 800);
}

ws.onmessage = message => {
    // Declaracion de constantes
    const response = JSON.parse(message.data);

    if (response.method === "connect") {
        clientId = response.clientId;

        console.log("-- Connected Succesfully --");
        console.log("< -------------------------- >");
    }

    if (response.method === "create") {
        gameId = response.game.id;

        alert(gameId);
        console.log("Join as Owner: " + gameId);
        console.log("With userId: " + clientId.substring(0, 5));
        console.log("< -------------------------- >");

        payLoad = {
            "method": "join",
            "clientId": clientId,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad));
    }

    if (response.method === "join") {
        gameId = response.game.id;
        pathArray = response.game.pathArray;
        response.game.clients.forEach((c, index) => {
            console.log('Player ' + (index + 1) + ' ID: ' + c.clientId.substring(0, 10));
        })
        if (!gameSet && pathArray !== null) {
            crearTarjetas(pathArray);
            gameSet = true;
        }
        if (yourTurn) {
            ableToPlay();
        }
    }

    if (response.method === "played") {
        cartasDiferentes(response.sameCards);
        if (response.playedBy == clientId) {
            $('.card_item').each(function () {
                $(this).off('click');
            });
            yourTurn = false;
        } else {
            ableToPlay();
            yourTurn = true;
        }
    }

    if (response.method === "one-click") {
        var card = response.card;
        $('.sin_voltear').each(function () {
            let card_value = $(this).children('.card_front').find('img').attr('value');
            if (card == card_value) {
                voltearCarta($(this));
            }
        });
    }
}

$(document).ready(function () {
    // Validacion de parametros
    if (create !== null && create === 'true') {
        yourTurn = true;
        $("#btnCreate").on("click", function () {

            console.log("-- Game Created Succesfully --");
            console.log("< -------------------------- >");

            let payLoad = {
                "method": "create",
                "clientId": clientId
            }
            ws.send(JSON.stringify(payLoad));
            $(this).hide();
        });
    } else if (join !== null && join === 'true' && joinId !== null) {
        yourTurn = false;
        $("#btnCreate").on("click", function () {

            console.log("Joined by Code: " + joinId);
            console.log("With userId: " + clientId.substring(0, 5));
            console.log("< -------------------------- >");

            const payLoad = {
                "method": "join",
                "clientId": clientId,
                "gameId": joinId
            }
            ws.send(JSON.stringify(payLoad));
            $(this).hide();
        });
    } else {
        alert("Ocurrio un error. Vuelve a la pantalla principal");
        window.location.href = "/";
    }
});




