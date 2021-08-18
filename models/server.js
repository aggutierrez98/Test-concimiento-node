const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuarios: "/api/usuarios",
        };

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    }

    listen() {
        const server = this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        });

        return server;
    }
}

module.exports = Server;