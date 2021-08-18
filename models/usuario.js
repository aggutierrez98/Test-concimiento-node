const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    last_name: {
        type: String,
        required: [true, "El apellido es obligatorio"],
    },
    legajo: {
        type: String,
        required: [true, "El legajo es obligatorio"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
    },
    birthday: {
        type: Date,
        required: [true, "La fecha de cumpleaños es obligatoria"],
    },
    age: {
        type: Number,
    }
});

UsuarioSchema.methods.toJSON = function () {
    let { __v, _id, legajo, email, birthday, ...usuario } = this.toObject();
    usuario.id = _id;
    return usuario;
};

module.exports = model("Usuario", UsuarioSchema);