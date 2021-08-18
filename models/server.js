const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

var envJSON = require('../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var port = envJSON[node_env].PORT

class Server {

    constructor() {
        this.app = express();
        this.port = port;

        this.paths = {
            usuarios: "/api/usuarios",
        };

        this.conectarDB();
        this.middlewares();
        this.routes();
    };

    async conectarDB() {
        await dbConnection();
    };

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    };

    routes() {
        this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    };

    listen() {
        const server = this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        });

        return server;
    };
}

module.exports = Server;