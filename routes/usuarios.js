const { Router } = require("express");
const { check } = require("express-validator");

const {
    usuariosGet,
    usuariosGetPorId,
    usuariosDelete,
    usuariosPost,
    usuariosPut,
} = require("../controllers/usuarios");

// const {
//     esRolValido,
//     emailExiste,
//     existeUsuarioPorId,
// } = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", usuariosGet);

router.get("/:id", [
    check("id", "El debe ser mongo valido").isMongoId(),
], usuariosGetPorId);

router.post("/", [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("last_name", "El apellido es obligatorio").not().isEmpty(),
    check("legajo", "El legajo es obligatorio").not().isEmpty(),
    // check("email").custom(emailExiste),
    check("birthday", "La fecha de cumpleaños es obligatoria").not().isEmpty(),
    validarCampos,
],
    usuariosPost
);

router.put("/:id", [
    check("id", "El debe ser mongo valido").isMongoId(),
    // check("id").custom(existeUsuarioPorId),
    validarCampos,
],
    usuariosPut
);

router.delete("/:id", [
    check("id", "El debe ser mongo valido").isMongoId(),
    // check("id").custom(existeUsuarioPorId),
    validarCampos,
],
    usuariosDelete
);

module.exports = router;