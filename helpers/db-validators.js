const { Role, Usuario, Categoria, Producto } = require('../models')

const esRolValido = async(rol = "") => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
};

const emailExiste = async(correo = "") => {

    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El mail ${correo} ya esta registrado en la db`)
    }
};

const existeUsuarioPorId = async(id) => {

    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El id no existe: 1${id}`)
    }
};

const existeCategoriaPorId = async(id) => {
    const existe = await Categoria.findById(id);
    if (!existe) {
        throw new Error(`La categoria ${id} no existe en DB`);
    }
};

const nombreExiste = async(nombre = "") => {

    nombre = nombre.toUpperCase()
    const existeNombre = await Categoria.findOne({ nombre });
    if (existeNombre) {
        throw new Error(`El nombre ${nombre} ya esta registrado en la db`)
    }
};


const nombreProductoExiste = async(nombre = "") => {

    nombre = nombre.toUpperCase()
    const existeNombre = await Producto.findOne({ nombre });
    if (existeNombre) {
        throw new Error(`El nombre ${nombre} ya esta registrado en la db`)
    }
};

const existeProductoPorId = async(id) => {
    const existe = await Producto.findById(id);
    if (!existe) {
        throw new Error(`El producto ${id} no existe en DB`);
    }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, las permitidas son: ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    nombreExiste,
    nombreProductoExiste,
    existeProductoPorId,
    coleccionesPermitidas
};