require("dotenv").config(); // Cargar variables de entorno

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "*Scoolers24_",
    database: process.env.DB_PROD_NAME || "gestion_documental_simplificada",
    host: process.env.DB_HOST || "34.175.89.166",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "*Scoolers24_",
    database: process.env.DB_PROD_NAME || "database_production",
    host: process.env.DB_HOST || "34.175.89.166",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "*Scoolers24_",
    database: process.env.DB_PROD_NAME || "database_production",
    host: process.env.DB_HOST || "34.175.89.166",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
};
