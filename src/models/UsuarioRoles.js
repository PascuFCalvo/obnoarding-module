// usuarioroles.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioRoles extends Model {
    static associate(models) {
      UsuarioRoles.belongsTo(models.Usuario, {
        foreignKey: "usuario_id",
        as: "usuario",
      });
      UsuarioRoles.belongsTo(models.Roles, {
        foreignKey: "rol_id",
        as: "rol",
      });
    }
  }

  UsuarioRoles.init(
    {},
    {
      sequelize,
      modelName: "UsuarioRoles",
      tableName: "usuarioroles",
      timestamps: true,
    }
  );

  return UsuarioRoles;
};
