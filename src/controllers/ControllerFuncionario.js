const { Funcionario } = require("../database/models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const usuario = await Funcionario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { userId: usuario.id, tipo: "Funcionário" },
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
