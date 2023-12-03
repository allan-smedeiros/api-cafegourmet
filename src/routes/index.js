require("dotenv").config();

// const Auth = require("../middlewares/auth");

const express = require("express");
const routes = express.Router();
const multer = require("multer");

const multerConfig = require("../config/multer");

const ControllerCliente = require("../controllers/ControllerCliente");
const ControllerProduto = require("../controllers/ControllerProduto");
const ControllerPedido = require("../controllers/ControllerPedido");
const ControllerFuncionario = require("../controllers/ControllerFuncionario");

routes.post("/cliente", ControllerCliente.cadastrarCliente);
routes.get("/cliente", ControllerCliente.listarClientes);
routes.put("/cliente/:id", ControllerCliente.editarCliente);
routes.post("/cliente/login", ControllerCliente.login);
routes.post("/funcionario/login", ControllerFuncionario.login);

routes.post(
  "/produto",
  multer(multerConfig).fields([{ name: "imagem", maxCount: 1 }]),
  ControllerProduto.cadastrarProduto
);
routes.get("/produto", ControllerProduto.listarProdutos);
routes.put("/produto/:id", ControllerProduto.editarProduto);

routes.post("/pedido", ControllerPedido.cadastrarPedido);
routes.get("/pedido", ControllerPedido.listarPedidos);
routes.put("/pedido/:id", ControllerPedido.atualizarPedido);
routes.get("/pedido/cliente/:id_cliente", ControllerPedido.ultimoPedido);

module.exports = routes;
