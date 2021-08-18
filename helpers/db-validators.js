const Usuario = require('../models/usuario');

const legajoExiste = async (legajo = "") => {

    const existeEmail = await Usuario.findOne({ legajo });
    if (existeEmail) {
        throw new Error(`El legajo ingresado ya esta registrado en la db`)
    }
};

const existeUsuarioPorId = async (id) => {

    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error("El id ingresado no esta registrado en la db")
    }
};


module.exports = {
    legajoExiste,
    existeUsuarioPorId,
};