const { Produto } = require("../database/models");

module.exports = {
  cadastrarProduto: async (req, res) => {
    try {
      const novoProduto = await Produto.create({
        nome: req.body.nome,
        valor: req.body.valor,
        ingredientes: req.body.ingredientes,
        imagem: req.files.imagem[0].filename,
        mostrar_vitrine: req.body.mostrar_vitrine,
      });

      return res.status(201).json({ produto: novoProduto });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  listarProdutos: async (req, res) => {
    try {
      const produtos = await Produto.findAll();
      return res.status(200).json({ produtos });
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  editarProduto: async (req, res) => {
    try {
      const produto = await Produto.findByPk(req.params.id);

      await produto.update({
        nome: req.body.nome || produto.nome,
        valor: req.body.valor || produto.valor,
        ingredientes: req.body.ingredientes || produto.ingredientes,
        imagem: req.body.imagem || produto.imagem,
        mostrar_vitrine: req.body.mostrar_vitrine,
      });

      return res.status(200).json({ produto });
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },
};
