// usuario.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Roles, {
        through: models.UsuarioRoles,
        foreignKey: "usuario_id",
        as: "roles", // Asegúrate de que este alias esté configurado
      });
      Usuario.hasMany(models.UsuarioRoles, {
        foreignKey: "usuario_id",
        as: "usuarioRoles",
      });
      Usuario.hasMany(models.Notificaciones, {
        foreignKey: "usuario_id",
        as: "notificaciones",
      });
    }
  }

  Usuario.init(
    {
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING,
      email: DataTypes.STRING,
      telefono: DataTypes.STRING,
      direccion: DataTypes.STRING,
      sociedad_id: DataTypes.INTEGER,
      marca_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: true,
    }
  );

  return Usuario;
};
