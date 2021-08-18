const { serverListening: server } = require("../app");
const mongoose = require("mongoose");
const { initialUser, api, } = require("./helpers");
const { Usuario } = require("../models");
const bcryptjs = require("bcryptjs");


describe("Pruebas en auth", () => {

    beforeAll(async () => {
        const usuario = new Usuario(initialUser);
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(initialUser.password, salt);
        await usuario.save();

        initialUser.id = usuario._id;
    });

    afterAll(async () => {
        await Usuario.deleteMany({});
        server.close();
        mongoose.connection.close();
    });

    test("debe hacer login correctamente", async () => {

        const response = await api
            .post("/api/auth/login")
            .send({
                correo: initialUser.correo,
                password: initialUser.password,
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /application\/json/)
            .expect(200);

        const { id, password, ...userCompare } = initialUser;

        expect(response.body.usuario).toMatchObject({
            ...userCompare,
        });
        expect(response.body.token).toBeDefined();
    });

    test("Debe hacer login de google correctamente", async () => {

        // await api
        //     .post("/api/auth/google")
        //     .send(data)
        //     .set("Accept", "application/json")
        //     .expect("Content-Type", /application\/json/)
        //     .expect(200)

    });


});
