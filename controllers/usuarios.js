const { response, request } = require("express");
const obtenerEdad = require("../helpers/obtenerEdad");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
    const { limit = 5, offset = 0 } = req.query;

    try {
        const usuarios = await Usuario.find().skip(Number(offset)).limit(Number(limit));

        const usuariosDevolver = usuarios.map(usuario => {
            return {
                id: usuario.id,
                name: usuario.name,
                last_name: usuario.last_name,
                age: usuario.age
            };
        })

        res.status(200).json(usuariosDevolver);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado"
        })
    };
};

const usuariosGetPorId = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const { name, last_name, age } = await Usuario.findById(id);

        res.status(200).json({
            id,
            name,
            last_name,
            age
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado"
        });
    };
};

const usuariosPost = async (req, res = response) => {
    const { name, last_name, legajo, email, birthday } = req.body;

    const age = obtenerEdad(birthday);

    try {
        const usuario = new Usuario({ name, last_name, legajo, email, birthday, age });
        await usuario.save();

        res.status(201).json({
            msg: "Creado exitosamente",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado"
        });
    };
};

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { legajo, email, age, birthday, ...resto } = req.body;

    if (birthday) {
        const age = obtenerEdad(birthday);
        resto.age = age;
    };

    try {
        await Usuario.findByIdAndUpdate(id, resto);

        res.status(200).json({
            msg: "Actualizado exitosamente",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado"
        });
    };
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        await Usuario.findByIdAndDelete(id);

        res.status(200).json({
            msg: "Borrado exitosamente",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error inesperado"
        });
    };
};

module.exports = {
    usuariosGet,
    usuariosGetPorId,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
};