require("dotenv").config();

const Server = require("./models/server")

const server = new Server();

const serverListening = server.listen();

module.exports = {
    app: server.app,
    serverListening,
}