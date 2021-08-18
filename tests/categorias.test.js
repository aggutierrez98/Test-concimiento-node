const { serverListening: server } = require("../app");
const mongoose = require("mongoose");
const Categoria = require("../models/categoria");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers");
const { initialCategories, initialUser, api, getAllCategorias, cargarIdPrimeraCategoria } = require("./helpers");

describe("Pruebas en categorias test", () => {
    beforeAll(async () => {
        const usuario = new Usuario(initialUser);
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(initialUser.password, salt);
        await usuario.save();

        initialUser.id = usuario._id;
    });

    beforeEach(async () => {
        initialCategories.map(categoria => categoria.usuario = initialUser.id);

        for (let category of initialCategories) {
            const categoryObject = new Categoria(category);
            await categoryObject.save();
        }
    });

    afterEach(async () => {
        await Categoria.deleteMany({});
    });

    afterAll(async () => {
        await Usuario.deleteMany({});
        server.close();
        mongoose.connection.close();
    });

    describe("Pruebas CATEGORIAS GET y GET por id", () => {

        test("Debe devolver todas las categorias correctamente", async () => {

            await (api)
                .get("/api/categorias/")
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);
        });

        test("Debe haber 2 categorias", async () => {

            const response = await (api).get("/api/categorias/");

            expect(response.body.categorias).toHaveLength(initialCategories.length);

        });

        test("La primera categoria debe ser correcta", async () => {

            const { nombres } = await getAllCategorias();

            expect(nombres).toContain(initialCategories[0].nombre);
        });

        test("Debe cargar una cateoria correctamente", async () => {

            const id = await cargarIdPrimeraCategoria();

            await (api)
                .get(`/api/categorias/${id}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);
        });

        test("Debe responder con error si el id no existe", async () => {

            const { body } = await (api)
                .get("/api/categorias/IDERRONEO")
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("No es un ID valido");
        });

    });

    describe("Pruebas CATEGORIAS POST", () => {

        test("Debe crear una cateoria correctamente", async () => {

            const newCategoria = {
                nombre: "Categoria nueva",
            };

            const token = await generarJWT(initialUser.id);

            await (api)
                .post("/api/categorias/")
                .set("x-token", token)
                .send(newCategoria)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(201);

            const { nombres, categorias } = await getAllCategorias();

            expect(nombres).toContain(newCategoria.nombre.toUpperCase());
            expect(categorias).toHaveLength(initialCategories.length + 1);
        });

        test("Debe fallar al crear categoria si el nombre no es un formato correcto", async () => {

            const newCategoria = {};

            const token = await generarJWT(initialUser.id);

            await (api)
                .post("/api/categorias/")
                .set("x-token", token)
                .send(newCategoria)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const response = await (api).get("/api/categorias/");

            expect(response.body.categorias).toHaveLength(initialCategories.length);
        });
    });

    describe("Pruebas CATEGORIAS PUT", () => {

        test("Debe actualizar la cateogoria correctamente", async () => {

            const id = await cargarIdPrimeraCategoria();

            const newData = {
                nombre: "nuevo nombre"
            };

            const token = await generarJWT(initialUser.id);

            await (api)
                .put(`/api/categorias/${id}`)
                .set("x-token", token)
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);

            const { nombres } = await getAllCategorias();

            expect(nombres).toContain(newData.nombre.toUpperCase());
        });

        test("Debe NO actualizar la cateogoria si el id es erroneo", async () => {

            const newData = {
                nombre: "nuevo nombre"
            };

            const token = await generarJWT(initialUser.id);

            const { body } = await (api)
                .put("/api/categorias/idErroneo")
                .set("x-token", token)
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("No es un ID valido");
        });

    });

    describe("Pruebas CATEGORIAS DELETE", () => {

        test("Debe borrar la cateogoria correctamente", async () => {

            const id = await cargarIdPrimeraCategoria();

            const token = await generarJWT(initialUser.id);

            await (api)
                .delete(`/api/categorias/${id}`)
                .set("x-token", token)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);

            const response = await (api).get("/api/categorias/");

            expect(response.body.categorias).toHaveLength(initialCategories.length - 1);
        });

        test("Debe NO borrar la cateogoria si el id es erroneo", async () => {

            const token = await generarJWT(initialUser.id);

            const { body } = await (api)
                .delete("/api/categorias/idErroneo")
                .set("x-token", token)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const response = await (api).get("/api/categorias/");

            expect(response.body.categorias).toHaveLength(initialCategories.length);

            expect(body.errors[0].msg).toBe("No es un ID valido");
        });

    });

});


