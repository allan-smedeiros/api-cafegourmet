const sequelize = require("sequelize");
const { Cliente } = require("../database/models");
const { ceps } = require("../utils/ceps");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  cadastrarCliente: async (req, res) => {
    try {
      const cpfExistente = await Cliente.findOne({
        where: {
          cpf: req.body.cpf,
        },
      });

      if (cpfExistente) {
        return res.status(400).json({ erro: "CPF já cadastrado" });
      }

      const emailExistente = await Cliente.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (emailExistente) {
        return res.status(400).json({ erro: "E-mail já cadastrado" });
      }

      if (!ceps.includes(req.body.cep.replace("-", ""))) {
        return res.status(400).json({ erro: "CEP fora da área de serviço" });
      }

      const hashedPassword = await bcrypt.hash(req.body.senha, 10);

      const novoCliente = await Cliente.create({
        nome: req.body.nome,
        data_nascimento: req.body.data_nascimento,
        email: req.body.email,
        senha: hashedPassword,
        cpf: req.body.cpf,
        cep: req.body.cep,
        endereco: req.body.endereco,
        num_endereco: req.body.num_endereco,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        complemento: req.body.complemento,
      });

      return res.status(201).json({ cliente: novoCliente });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  listarClientes: async (req, res) => {
    try {
      const clientes = await Cliente.findAll();
      return res.status(200).json({ clientes });
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  editarCliente: async (req, res) => {
    try {
      const emailExistente = await Cliente.findOne({
        where: {
          email: req.body.email,
          id: { [sequelize.Op.not]: req.params.id },
        },
      });

      if (emailExistente) {
        return res
          .status(400)
          .json({ erro: "E-mail já cadastrado por outro cliente" });
      }

      const hashedPassword = req.body.senha
        ? await bcrypt.hash(req.body.senha, 10)
        : undefined;

      const cliente = await Cliente.findByPk(req.params.id);

      await cliente.update({
        email: req.body.email ? req.body.email : cliente.email,
        senha: req.body.senha ? hashedPassword : cliente.senha,
      });

      return res.status(200).json({ cliente });
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  login: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const usuario = await Cliente.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        {
          userId: usuario.id,
          tipo: "cliente",
          endereco: `${usuario.endereco}, ${usuario.num_endereco} - ${usuario.bairro}, ${usuario.cidade} - ${usuario.uf} - ${usuario.cep}`,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "4h",
        }
      );

      res.json({ token });
    } catch (error) {
      console.error("Erro ao logar:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },
};
