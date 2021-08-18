const mongoose = require('mongoose');

var envJSON = require('../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var connectionString = envJSON[node_env].MONGO_DB_CNN

const dbConnection = async () => {

    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log("Base de datos conectada");

    } catch (e) {
        console.log(e);
        throw new Error('Error a la hora de iniciar la DB');
    }
}

module.exports = {
    dbConnection
}