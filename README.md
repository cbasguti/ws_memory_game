# TheCodeMemory

Este juego está pensado para ser utilizado en navegadores, por lo que no es necesario instalarlo si solo deseas jugar. Puedes acceder al juego directamente desde https://code-memory.herokuapp.com.

- [TheCodeMemory](#thecodememory)
  * [Instalación](#instalaci-n)
  * [Contribución](#contribuci-n)
  * [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Instalación

Sin embargo, si deseas clonar el repositorio para instalar o ejecutar el juego en una red local, debes tener en cuenta lo siguiente:

Asegúrate de tener instalado Node.js y NPM.
Clona el repositorio en tu equipo.
Ejecuta npm install en la raíz del proyecto para instalar las dependencias necesarias.

```bash
npm install
```

Ejecuta el archivo index.js para iniciar el servidor.
Si deseas jugar en local, debes modificar la línea 15 del archivo game-controller.js y cambiarla por let ws = new WebSocket(ws://localhost:3000/);.
¡Eso es todo! Gracias por tu interés en TheCodeMemory. Si tienes algún problema o pregunta, no dudes en contactar al desarrollador.

## Contribución

Es un repositorio público, si desean contribuir al proyecto o desarrollo del juego, pueden trabajar tranquilamente en la rama develop y así pueden mandar pull requests a la rama main

## License

[MIT License](https://choosealicense.com/licenses/mit/)
