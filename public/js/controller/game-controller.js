// Declaracion de constantes
const params = new URLSearchParams(window.location.search);
const create = params.get('create');
const join = params.get('join');
const joinId = params.get('gameId');
const cardBackId = params.get('cardBack');
const username = params.get('username');


// Declaracion de variables
let clientId = null;
let gameId = null;
let pathArray = null;
let yourTurn = null;
let ws = new WebSocket(`https://code-memory.herokuapp.com/`);
var clicks = 0;
var languages = [];
var cards = [];
var puntaje = 0;
var gameSet = false;

/* < ---- Declaracion de Funciones ---- >*/

// Crear las tarjetas
function crearTarjetas(pathArray, cardBackId) {
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
        const frontImg = $("<img>").addClass("card-img").addClass(imgClass).attr("src", "/img/cardback" + cardBackId + ".png").attr("alt", "Card image cap").attr("value", i);
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
                    puntaje += 150;
                    console.log("-- Good Work! You gained " + puntaje + " points --");
                    console.log("With userId: " + clientId.substring(0, 5));
                    console.log("< -------------------------- >");
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

                puntaje = 0;
                clicks = 0;
                languages = [];
            }
        }
    });
}

function seAcabó(){
    let terminado = true;
    $('.card_item').each(function () {
        if (!$(this).hasClass('lista')) {
            terminado = false;
        }
    })
    return terminado;
}

function voltearCarta(carta) {
    carta.toggleClass('flipped');
    carta.removeClass('sin_voltear');
    carta.addClass('volteada');
}

function cartasDiferentes(iguales) {
    return new Promise(function(resolve, reject) {
        // Tu código aquí
        // Cuando la función termine de ejecutarse, resuelve la promesa
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
                    $(this).addClass('lista');
                });
            }
            resolve();
        }, 800);
    });
}

ws.onmessage = message => {
    // Declaracion de constantes
    const response = JSON.parse(message.data);

    if (response.method === "connect") {
        clientId = response.clientId;

        console.log("-- Connected Succesfully --");
        console.log("< -------------------------- >");
        $("#btnCreate").trigger("click");
    }

    if (response.method === "create") {
        gameId = response.game.id;

        console.log("Join as Owner: " + gameId);
        console.log("With userId: " + clientId.substring(0, 5));
        console.log("< -------------------------- >");

        payLoad = {
            "method": "join",
            "clientId": clientId,
            "clientName": username,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad));
    }

    if (response.method === "join") {
        gameId = response.game.id;
        cardBack = response.game.cardBack;
        pathArray = response.game.pathArray;
        console.log(response);
        response.game.clients.forEach((c, index) => {
            console.log('Player ' + (index + 1) + ' ID: ' + c.clientId.substring(0, 10));
            console.log('Player ' + (index + 1) + ' Name: ' + c.clientName);
            console.log("< -------------------------- >");
        })
        if (!gameSet && pathArray !== null) {
            crearTarjetas(pathArray, cardBack);
            gameSet = true;
        }
        if (yourTurn) {
            ableToPlay();
        }
    }

    if (response.method === "played") {
        cartasDiferentes(response.sameCards).then(function() {
            if (response.sameCards) {
                // Keep playing
            } else {
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

            if (seAcabó()) {
                // Se terminó el juego
                let ganadorName = null;
                let mayorPuntaje = 0;
                const jugadores = response.game.clients;
                jugadores.forEach((c, index) => {
                    if (c.puntaje > mayorPuntaje) {
                        mayorPuntaje = c.puntaje;
                        ganadorName = c.clientName;
                    }
                })
                alert("SE HA TERMINADO EL JUEGO\nGanador: " + ganadorName +"\nPuntos: " + mayorPuntaje);
            }
        });
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
                "clientId": clientId,
                "cardBack": cardBackId
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
                "clientName": username,
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




