const mongoose = require('mongoose');

const { MONGODB_CNN, MONGODB_TEST_CNN, NODE_ENV } = process.env;

const connectionString = NODE_ENV === "test"
    ? MONGODB_TEST_CNN
    : MONGODB_CNN

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