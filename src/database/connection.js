require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env["BD_NAME"],
  process.env["BD_USER"],
  process.env["BD_PASS"],
  {
    host: process.env["BD_HOST"],
    dialect: "mysql",
    charset: "utf8",
    collate: "utf8_general_ci",
    timezone: "-03:00",
    logging: true,
    port: process.env.BD_PORT,
  }
);

async function testConn() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("conexão com o banco realizada com sucesso");
  } catch (error) {
    console.log(error);
    console.error("falha ao se conectar com o banco: ", error?.message);
  }
}

testConn();

module.exports = sequelize;
