"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Login extends Model {
    static associate(models) {
      Login.hasOne(models.Usuario, { foreignKey: "login_id", as: "usuario" });
    }
  }

  Login.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      last_login: DataTypes.DATE,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Login",
      tableName: "Login",
      timestamps: true,
    }
  );

  return Login;
};
