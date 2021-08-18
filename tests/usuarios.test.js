const { serverListening: server } = require("../app");
const mongoose = require("mongoose");
const Usuario = require("../models/usuario");
const { initialUsers, getAllUsers, cargarIdPrimerUser, api } = require("./helpers");
const obtenerEdad = require("../helpers/obtenerEdad");

describe('Pruebas en Usuarios', () => {
    beforeEach(async () => {
        for (let user of initialUsers) {
            const userObject = new Usuario(user);
            await userObject.save();
        };
    });

    afterEach(async () => {
        await Usuario.deleteMany({});
    });

    afterAll(async () => {
        server.close();
        mongoose.connection.close();
    });

    describe("Pruebas USUARIOS GET y GET por id", () => {

        test("Debe devolver todos los usuarios correctamente", async () => {

            const response = await (api)
                .get("/api/usuarios/")
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);

            expect(response.body).toHaveLength(initialUsers.length);
        });


        test("El primer usuario debe ser el correcto", async () => {

            const { nombres } = await getAllUsers();

            expect(nombres).toContain(initialUsers[0].name);
        });

        test("Debe cargar un usuario correctamente", async () => {

            const id = await cargarIdPrimerUser();

            await (api)
                .get(`/api/usuarios/${id}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);
        });

        test("Debe responder con error si el id no es mongo valido", async () => {

            const { body } = await (api)
                .get("/api/usuarios/IDERRONEO")
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("El id debe ser mongo valido");
        });

        test("Debe responder con error si el id no existe", async () => {

            const id = "611d06ea2196b8a43814dfd2";

            const { usuarios } = await getAllUsers();

            const usuario = usuarios.find(usuario => usuario.id === id);

            //Si el id no existe en la base de datos
            if (!usuario) {
                const { body } = await (api)
                    .get(`/api/usuarios/${id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /application\/json/)
                    .expect(400);

                expect(body.errors[0].msg).toBe("El id ingresado no esta registrado en la db");
            }
        });
    });

    describe("Pruebas USUARIOS POST", () => {

        test("Debe crear un usuario correctamente", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(201);

            const { nombres, usuarios } = await getAllUsers();

            expect(nombres).toContain(newUsuario.name);
            expect(usuarios).toHaveLength(initialUsers.length + 1);
        });

        test("Debe fallar al crear usuario si el nombre no es enviado", async () => {

            const newUsuario = {
                last_name: "Godoy",
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El nombre es obligatorio");
        });

        test("Debe fallar al crear usuario si el nombre no tiene el formato correcto", async () => {

            const newUsuario = {
                name: 1234,
                last_name: "Godoy",
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El nombre debe ser string");
        });

        test("Debe fallar al crear usuario si el apellido no es enviado", async () => {

            const newUsuario = {
                name: "Jose",
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El apellido es obligatorio");
        });

        test("Debe fallar al crear usuario si el apellido no tiene el formato correcto", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: 1234,
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El apellido debe ser string");
        });

        test("Debe fallar al crear usuario si el legajo no es enviado", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El legajo es obligatorio");
        });

        test("Debe fallar al crear usuario si el legajo no tiene el formato correcto", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: 1234,
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El legajo debe ser string");
        });

        test("Debe fallar al crear usuario si el legajo ya existe", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: initialUsers[0].legajo,
                email: "joseGod@gmail.com",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El legajo ingresado ya esta registrado en la db");
        });

        test("Debe fallar al crear usuario si el email no es enviado", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: "josegodoy",
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El email es obligatorio");
        });

        test("Debe fallar al crear usuario si el email no tiene el formato correcto", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: "josegodoy",
                email: 1234,
                birthday: "March 10, 1970 08:30:00"
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("El debe ser valido");
        });

        test("Debe fallar al crear usuario si la fecha de nacimiento no es enviada", async () => {

            const newUsuario = {
                name: "Jose",
                last_name: "Godoy",
                legajo: "josegodoy",
                email: "joseGod@gmail.com",
            };

            const { body } = await (api)
                .post("/api/usuarios/")
                .send(newUsuario)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();
            expect(usuarios).toHaveLength(initialUsers.length);
            expect(body.errors[0].msg).toBe("La fecha de nacimiento es obligatoria");
        });

    });

    describe("Pruebas USUARIOS PUT", () => {

        test("Debe actualizar el usuario correctamente", async () => {

            const id = await cargarIdPrimerUser();

            const newData = {
                name: "nuevo nombre",
                last_name: "nuevo apellido",
                birthday: "January 25, 1980 08:30:00",
            };

            const age = obtenerEdad(newData.birthday);

            await (api)
                .put(`/api/usuarios/${id}`)
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);

            const { usuarios } = await getAllUsers();

            expect(usuarios[0]).toMatchObject({
                name: newData.name,
                last_name: newData.last_name,
                age,
            });
        });

        test("Debe NO actualizar el usuario si el nombre no es string", async () => {

            const id = await cargarIdPrimerUser();

            const newData = {
                name: 1234,
                last_name: "nuevo apellido",
            };

            const { body } = await (api)
                .put(`/api/usuarios/${id}`)
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("El nombre debe ser string");
        });

        test("Debe NO actualizar el usuario si el apellido no es string", async () => {

            const id = await cargarIdPrimerUser();

            const newData = {
                name: "nuevo nombre",
                last_name: 1234,
            };

            const { body } = await (api)
                .put(`/api/usuarios/${id}`)
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("El apellido debe ser string");
        });

        test("Debe NO actualizar el usuario si el id es erroneo", async () => {

            const newData = {
                nombre: "nuevo nombre"
            };

            const { body } = await (api)
                .put("/api/usuarios/idErroneo")
                .send(newData)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            expect(body.errors[0].msg).toBe("El id debe ser mongo valido");
        });

    });

    describe("Pruebas USUARIOS DELETE", () => {

        test("Debe borrar el usuario correctamente", async () => {

            const id = await cargarIdPrimerUser();

            await (api)
                .delete(`/api/usuarios/${id}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(200);

            const { usuarios } = await getAllUsers();

            expect(usuarios).toHaveLength(initialUsers.length - 1);
        });

        test("Debe NO borrar el usuario si el id no es mongo valido", async () => {

            const { body } = await (api)
                .delete("/api/usuarios/idErroneo")
                .set("Accept", "application/json")
                .expect("Content-Type", /application\/json/)
                .expect(400);

            const { usuarios } = await getAllUsers();

            expect(usuarios).toHaveLength(initialUsers.length);

            expect(body.errors[0].msg).toBe("El id debe ser mongo valido");
        });

        test("Debe NO borrar el usuario si el id no existe", async () => {

            const id = "611d06ea2196b8a43814dfd2";

            const { usuarios } = await getAllUsers();

            const usuario = usuarios.find(usuario => usuario.id === id);

            //Si el id no existe en la base de datos
            if (!usuario) {
                const { body } = await (api)
                    .delete(`/api/usuarios/${id}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /application\/json/)
                    .expect(400);

                expect(usuarios).toHaveLength(initialUsers.length);

                expect(body.errors[0].msg).toBe("El id ingresado no esta registrado en la db");
            }
        });
    });

});
