const routes = require("express").Router();
const FilmeController = require("../controllers/FilmeControllers");

routes.get("/", FilmeController.getAll);
routes.get("/filmes/:id", FilmeController.getById);
routes.get("/criar", FilmeController.criar);
routes.post("/criacao", FilmeController.criacao);
routes.get("/editar/:id", FilmeController.editar1);
routes.post("/editar/:id", FilmeController.editar);
routes.get("/deletar/:id", FilmeController.deletar);
module.exports = routes;