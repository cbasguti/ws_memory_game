const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const newPort = parseInt(process.env.PORT || 3000) + 1;

// Menu principal
app.get("/", (req, res) => res.sendFile(__dirname + "/client/index.html"));

// Creacion de juego
app.get("/crear-juego", (req, res) => res.sendFile(__dirname + "/client/create.html"));

// El juego
app.get("/partida", (req, res) => res.sendFile(__dirname + "/client/game.html"));

const realServer = app.listen(port, () => console.log("Listening... on http port " + port));
app.use(express.static(path.join(__dirname, "public")));
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(newPort, () => console.log("Listening... on " + newPort));

// Hashmap
const clients = {};
const games = {};

// Función para mezclar el array
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // Mientras queden elementos para mezclar
    while (currentIndex !== 0) {
        // Selecciona un elemento restante
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // Intercambia el elemento restante con el actual
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const wsServer = new websocketServer({
    "httpServer": realServer
});

wsServer.on("request", request => {
    // Iniciar conexion
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Abierto!"));
    connection.on("close", () => console.log("Cerrado!"));
    connection.on("message", message => {

        const result = JSON.parse(message.utf8Data);
        // Se recibe un mensaje

        if (result.method === "create") {
            // console.log(result);
            const clientId = result.clientId;
            const gameId = guid();
            const imgPaths = [
                '/img/logo/cplus.png',
                '/img/logo/csharp.png',
                '/img/logo/fortran.png',
                '/img/logo/java.png',
                '/img/logo/javascript.png',
                '/img/logo/laravel.png',
                '/img/logo/node.png',
                '/img/logo/php.png',
                '/img/logo/python.png',
                '/img/logo/r.png',
                '/img/logo/rails.png',
                '/img/logo/ruby.png'
            ]; // Rutas a las imagenes
            const imgPaths2x = imgPaths.concat(imgPaths); // Duplica el array de imágenes y los combina en uno solo

            shuffle(imgPaths2x);
            games[gameId] = {
                "id": gameId,
                "clients": [],
                "pathArray": imgPaths2x,
                "cardBack": result.cardBack
            }

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const conn = clients[clientId].connection;
            conn.send(JSON.stringify(payLoad));
        }

        if (result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const nombre = result.clientName;
            const game = games[gameId];

            // Validar si el juego existe
            if (!game) {
                const payLoad = {
                    "method": "game_not_found"
                }
                clients[clientId].connection.send(JSON.stringify(payLoad));
                return;
            }

            if (game.clients.length >= 2) {
                // Max players reach
                return;
            }

            game.clients.push({
                "clientId": clientId,
                "clientName": nombre,
                "puntaje": 0
            })

            const payLoad = {
                "method": "join",
                "game": game
            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }

        if (result.method === "played") {
            console.log(result);
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            const client = game.clients.find(c => c.clientId === clientId);

            if (client) {
                client.puntaje = client.puntaje + result.points;
            }

            const payLoad = {
                "method": "played",
                "game": game,
                "sameCards": result.sameCards,
                "playedBy": result.playedBy
            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }

        if (result.method === "one-click") {
            const gameId = result.gameId;
            const game = games[gameId];

            const payLoad = {
                "method": "one-click",
                "card": result.card
            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })
        }

    });

    // Generar un clientId
    const clientId = cuid();
    clients[clientId] = {
        "connection": connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }

    // Retornar la conexion del cliente
    connection.send(JSON.stringify(payLoad));
})



function S4() {
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// then to call it, plus stitch in '4' in the third group
const cuid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4());
const guid = () => S4();