const { Pedido, ProdutosPedido, Cliente } = require("../database/models");

module.exports = {
  cadastrarPedido: async (req, res) => {
    try {
      const novoPedido = await Pedido.create({
        data: new Date(),
        total: req.body.total,
        status: "Pendente",
        endereco: req.body.endereco,
        forma_pgto: req.body.formaPgto,
        id_cliente: req.body.id_cliente,
      });

      await ProdutosPedido.bulkCreate(
        req.body.itens.map((item) => ({
          nome: item.nome,
          valor: item.valor,
          quantidade: item.quantidade,
          ingredientes: item.ingredientes,
          id_produto: item.id,
          id_pedido: novoPedido.id,
        }))
      );

      return res.status(201).json({ pedido: novoPedido });
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  atualizarPedido: async (req, res) => {
    try {
      const pedido = await Pedido.findByPk(req.params.id);

      await pedido.update({
        status: req.body.status,
      });

      return res.status(201).json({ pedido });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  listarPedidos: async (req, res) => {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          {
            model: ProdutosPedido,
          },
          {
            model: Cliente,
          },
        ],
      });
      return res.status(200).json({ pedidos });
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },

  ultimoPedido: async (req, res) => {
    try {
      const pedido = await Pedido.findOne({
        where: {
          id_cliente: req.params.id_cliente,
        },
        include: [
          {
            model: ProdutosPedido,
          },
          {
            model: Cliente,
          },
        ],
        order: [["data", "DESC"]],
      });
      return res.status(200).json({ pedido });
    } catch (error) {
      console.error("Erro ao listar pedido:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },
};
