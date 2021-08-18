const { Router } = require("express");
const { check } = require("express-validator");

const {
    usuariosGet,
    usuariosGetPorId,
    usuariosDelete,
    usuariosPost,
    usuariosPut,
} = require("../controllers/usuarios");

const {
    existeUsuarioPorId,
    legajoExiste,
} = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", usuariosGet);

router.get("/:id", [
    check("id", "El id debe ser mongo valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
], usuariosGetPorId);

router.post("/", [
    check("name", "El nombre es obligatorio").notEmpty(),
    check("name", "El nombre debe ser string").isString(),
    check("last_name", "El apellido es obligatorio").notEmpty(),
    check("last_name", "El apellido debe ser string").isString(),
    check("legajo", "El legajo es obligatorio").notEmpty(),
    check("legajo", "El legajo debe ser string").isString(),
    check("legajo").custom(legajoExiste),
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "El debe ser valido").isEmail(),
    check("birthday", "La fecha de nacimiento es obligatoria").notEmpty(),
    validarCampos,
],
    usuariosPost
);

router.put("/:id", [
    check("id", "El id debe ser mongo valido").isMongoId(),
    check("name", "El nombre debe ser string").if((value, { req }) => req.body.name).isString(),
    check("last_name", "El apellido debe ser string").if((value, { req }) => req.body.name).isString(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
],
    usuariosPut
);

router.delete("/:id", [
    check("id", "El id debe ser mongo valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
],
    usuariosDelete
);

module.exports = router;