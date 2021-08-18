const { serverListening: server } = require('../app');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const bcryptjs = require("bcryptjs");
const { generarJWT } = require('../helpers');
const { initialUser, api, initialProducts, initialCategories, cargarIdPrimerProducto, getAllProductos } = require('./helpers');
const { Producto, Categoria } = require('../models');

beforeAll(async () => {
    const usuario = new Usuario(initialUser);
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(initialUser.password, salt);
    await usuario.save();

    initialUser.id = usuario._id;

    initialCategories.map(categoria => categoria.usuario = initialUser.id);

    for (let category of initialCategories) {
        const categoryObject = new Categoria(category);
        category.id = categoryObject._id;
        await categoryObject.save();
    }
});

beforeEach(async () => {
    initialProducts.map(product => {
        product.usuario = initialUser.id
        product.categoria = initialCategories[0].id
    });

    for (let product of initialProducts) {
        const productObject = new Producto(product);
        await productObject.save();
    }
});

afterEach(async () => {
    await Producto.deleteMany({});
});

afterAll(async () => {
    await Usuario.deleteMany({});
    await Categoria.deleteMany({});

    server.close();
    mongoose.connection.close();
});

describe('Pruebas PRODUCTOS GET y GET por id', () => {

    test('Debe devolver todos los productos correctamente', async () => {

        await (api)
            .get("/api/productos/")
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(200)
    });

    test('Debe haber 2 productos', async () => {

        const response = await (api).get("/api/productos/");

        expect(response.body.productos).toHaveLength(initialProducts.length);

    });

    test('El primer producto debe ser correcto', async () => {

        const { nombres } = await getAllProductos();

        expect(nombres).toContain(initialProducts[0].nombre);
    });

    test('Debe cargar un producto correctamente', async () => {

        const id = await cargarIdPrimerProducto();

        await (api)
            .get(`/api/productos/${id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(200)
    });

    test('Debe responder con error si el id no existe', async () => {

        const { body } = await (api)
            .get(`/api/productos/IDERRONEO`)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(400)

        expect(body.errors[0].msg).toBe("No es un ID valido");
    });

});

describe('Pruebas CATEGORIAS POST', () => {

    test('Debe crear una cateoria correctamente', async () => {

        const newProduct = {
            nombre: "nuevo producto",
            categoria: initialCategories[0].id
        };

        const token = await generarJWT(initialUser.id);

        await (api)
            .post(`/api/productos/`)
            .set('x-token', token)
            .send(newProduct)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(201)

        const { nombres, productos } = await getAllProductos();

        expect(nombres).toContain(newProduct.nombre.toUpperCase());
        expect(productos).toHaveLength(initialProducts.length + 1);
    });

    test('Debe fallar al crear categoria si el nombre no es un formato correcto', async () => {

        const newProduct = {};

        const token = await generarJWT(initialUser.id);

        await (api)
            .post(`/api/productos/`)
            .set('x-token', token)
            .send(newProduct)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(400)

        const response = await (api).get("/api/productos/");

        expect(response.body.productos).toHaveLength(initialProducts.length);
    });
});

describe('Pruebas PRODUCTOS PUT', () => {

    test('Debe actualizar el producto correctamente', async () => {

        const id = await cargarIdPrimerProducto();

        const newData = {
            nombre: "nuevo nombre",
        };

        const token = await generarJWT(initialUser.id);

        await (api)
            .put(`/api/productos/${id}`)
            .set('x-token', token)
            .send(newData)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(200)

        const { nombres } = await getAllProductos();

        expect(nombres).toContain(newData.nombre.toUpperCase());
    });

    test('Debe NO actualizar el producto si el id es erroneo', async () => {

        const newData = {
            nombre: "nuevo nombre"
        };

        const token = await generarJWT(initialUser.id);

        const { body } = await (api)
            .put(`/api/productos/idErroneo`)
            .set('x-token', token)
            .send(newData)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(400)

        expect(body.errors[0].msg).toBe("No es un id de mongo valido");
    });
});

describe('Pruebas CATEGORIAS DELETE', () => {

    test('Debe borrar el producto correctamente', async () => {

        const id = await cargarIdPrimerProducto();

        const token = await generarJWT(initialUser.id);

        await (api)
            .delete(`/api/productos/${id}`)
            .set('x-token', token)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(200)

        const response = await (api).get("/api/productos/");

        expect(response.body.productos).toHaveLength(initialProducts.length - 1);
    });

    test('Debe NO borrar el producto si el id es erroneo', async () => {

        const token = await generarJWT(initialUser.id);

        const { body } = await (api)
            .delete(`/api/productos/idErroneo`)
            .set('x-token', token)
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(400)

        const response = await (api).get("/api/productos/");

        expect(response.body.productos).toHaveLength(initialProducts.length);

        expect(body.errors[0].msg).toBe("No es un ID valido");
    });

});


