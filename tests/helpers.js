const supertest = require("supertest");
const { app } = require("../app");

const api = supertest(app);

const initialCategories = [
    {
        nombre: "lacteos",
    },
    {
        nombre: "vegetales",
    },
];

const initialProducts = [
    {
        nombre: "leche",
    },
    {
        nombre: "yogurt",
    },
];

const initialUser = {
    nombre: "agustin",
    correo: "agustin@test.com",
    password: "123456",
    rol: "ADMIN_ROLE",
};

const getAllCategorias = async () => {
    const response = await api.get("/api/categorias/");
    const nombres = response.body.categorias.map((categoria) => categoria.nombre);
    return {
        nombres,
        categorias: response.body.categorias,
    };
};

const cargarIdPrimeraCategoria = async () => {
    const response = await api.get("/api/categorias/");
    const id = response.body.categorias[0]._id;
    return id;
};

const getAllProductos = async () => {
    const response = await api.get("/api/productos/");
    const nombres = response.body.productos.map((producto) => producto.nombre);
    return {
        nombres,
        productos: response.body.productos,
    };
};

const cargarIdPrimerProducto = async () => {
    const response = await api.get("/api/productos/");
    const id = response.body.productos[0]._id;
    return id;
};

module.exports = {
    initialCategories,
    initialUser,
    api,
    getAllCategorias,
    cargarIdPrimeraCategoria,
    initialProducts,
    getAllProductos,
    cargarIdPrimerProducto,
};
