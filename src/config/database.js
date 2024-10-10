const { Sequelize } = require("sequelize");
require("dotenv").config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: process.env.DB_DIALECT, // Dialecto de la base de datos (mysql)
    port: process.env.DB_PORT, // Puerto de la base de datos
    logging: false, // Desactivar logging de SQL
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = sequelize;
