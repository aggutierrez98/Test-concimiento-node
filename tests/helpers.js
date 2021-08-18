const supertest = require("supertest");
const { app } = require("../app");

const api = supertest(app);

const initialUsers = [
    {
        name: "Juan",
        last_name: "Garay",
        legajo: "juanga",
        email: "juanga@gmail.com",
        birthday: "January 25, 1985 08:30:00"
    }, {
        name: "Ramon",
        last_name: "Pererez",
        legajo: "ramonpe",
        email: "ramonperez@gmail.com",
        birthday: "April 21, 1965 10:45:00"
    }
];

const getAllUsers = async () => {
    const response = await api.get("/api/usuarios");
    const nombres = response.body.map((usuario) => usuario.name);
    return {
        nombres,
        usuarios: response.body,
    };
};

const cargarIdPrimerUser = async () => {
    const response = await api.get("/api/usuarios");
    return response.body[0].id;
};

module.exports = {
    initialUsers,
    api,
    getAllUsers,
    cargarIdPrimerUser,
};
