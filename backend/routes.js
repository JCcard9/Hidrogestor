const express = require("express");
const usuariosController = require("./controllers/usuariosController");
const leituraController = require("./controllers/leituraController");
const faturaController = require("./controllers/faturaController");

const router = express.Router();

// Rotas de usuários
router.get("/listarUsuarios", usuariosController.listarUsuarios);
router.post("/login", usuariosController.login);
router.post("/gravarNovoUsuario", usuariosController.gravarNovoUsuario);
router.post("/verificarDuplicatas", usuariosController.verificarDuplicatas);
router.put("/atualizarUsuario/:id", usuariosController.atualizarUsuario);
router.delete("/excluirUsuario/:id", usuariosController.excluirUsuario);

// Rotas de leituras
router.get("/listarLeitura/:id", leituraController.listarLeituras);
router.post("/gravarNovaLeitura", leituraController.gravarNovaLeitura);
router.get("/exportarLeituras/:id", leituraController.exportarLeituras);
router.delete("/excluirLeitura/:id", leituraController.excluirLeitura);

// Rotas de faturas
router.get("/listarFaturas/:id", faturaController.listarFaturas);
router.get("/exportarFaturas/:id", faturaController.exportarFaturas);

module.exports = router;
