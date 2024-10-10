"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Roles extends Model {
    static associate(models) {
      Roles.belongsToMany(models.Usuario, {
        through: models.UsuarioRoles,
        foreignKey: "rol_id",
        as: "usuarios", // Alias para referirse a la asociación
      });
    }
  }

  Roles.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Roles",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Roles;
};
