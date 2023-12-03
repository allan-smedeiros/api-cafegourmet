const { DataTypes } = require("sequelize");
const connection = require("../connection");

const Cliente = connection.define(
  "cliente",
  {
    nome: DataTypes.STRING,
    data_nascimento: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    cpf: DataTypes.STRING,
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    bairro: DataTypes.STRING,
    num_endereco: DataTypes.STRING,
    cidade: DataTypes.STRING,
    uf: DataTypes.STRING,
    complemento: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

const Funcionario = connection.define(
  "funcionario",
  {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

const Produto = connection.define(
  "produto",
  {
    nome: DataTypes.STRING,
    valor: DataTypes.DECIMAL(10, 2),
    ingredientes: DataTypes.TEXT,
    imagem: DataTypes.STRING,
    mostrar_vitrine: DataTypes.BOOLEAN,
  },
  {
    freezeTableName: true,
  }
);

const Pedido = connection.define(
  "pedido",
  {
    data: DataTypes.DATE,
    forma_pgto: DataTypes.STRING,
    total: DataTypes.DECIMAL(10, 2),
    status: DataTypes.STRING,
    endereco: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

const ProdutosPedido = connection.define(
  "produtos_pedido",
  {
    nome: DataTypes.STRING,
    valor: DataTypes.DECIMAL(10, 2),
    ingredientes: DataTypes.TEXT,
    quantidade: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
  }
);

Cliente.hasMany(Pedido, { foreignKey: "id_cliente" });
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente" });

Pedido.hasMany(ProdutosPedido, { foreignKey: "id_pedido" });
Produto.hasMany(ProdutosPedido, { foreignKey: 'id_produto'})

ProdutosPedido.belongsTo(Produto, { foreignKey: "id_produto" });
ProdutosPedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

module.exports = {
  Cliente,
  Pedido,
  Produto,
  Funcionario,
  ProdutosPedido,
};
