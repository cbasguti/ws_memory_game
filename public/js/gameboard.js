// Rutas a las imagenes
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
];

// Duplica el array de imágenes y los combina en uno solo
const imgPaths2x = imgPaths.concat(imgPaths);

// Mezcla el array de rutas de imagen
shuffle(imgPaths2x);

// Crear las tarjetas
function crearTarjetas() {
    // Seleccionar el contenedor de tarjetas
    const cardContainer = $(".card_container");

    // Definir el número de tarjetas a crear
    const numCards = 24;

    // Crear las tarjetas
    for (let i = 0; i < numCards; i++) {
        // Crear el elemento de la tarjeta
        const card = $("<div>").addClass("card_item sin_voltear");

        // Crear el elemento de la parte delantera
        const front = $("<div>").addClass("card_front");
        const frontImg = $("<img>").addClass("card-img").attr("src", "/img/cardback3.png").attr("alt", "Card image cap");
        front.append(frontImg);

        // Crear el elemento de la parte trasera
        const imgClass = imgPaths2x[i].split("/").pop().replace(".png", "");
        const back = $("<div>").addClass("card_back");
        const backImg = $("<img>").addClass("card-img").addClass(imgClass).attr("src", imgPaths2x[i]).attr("alt", "Card image cap");
        back.append(backImg);

        // Agregar la parte delantera y trasera a la tarjeta y agregar la tarjeta al contenedor
        card.append(front).append(back);
        cardContainer.append(card);
    }
}

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

$(document).ready(function () {
    var clicks = 0;
    var languages = [];

    // Pintar el tablero
    crearTarjetas();

    $('.sin_voltear').click(function () {
        $(this).toggleClass('flipped');
        $(this).removeClass('sin_voltear');
        $(this).addClass('volteada');
        clicks += 1;

        let language = $(this).find('.card_back').find('.card-img').attr('class').split(' ').pop();
        languages.push(language);

        if (clicks >= 2) {

            let iguales = languages.every(function (element) {
                return element === languages[0];
            });

            clicks = 0;
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
                        $(this).off('click');
                    });
                }
            }, 800);

            languages = [];
        }
    });
});

