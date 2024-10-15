// usuario.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Roles, {
        through: models.UsuarioRoles,
        foreignKey: "id_usuario",
        as: "roles",
      });
      Usuario.hasMany(models.UsuarioRoles, {
        foreignKey: "id_usuario",
        as: "usuarioRoles",
      });
      Usuario.hasMany(models.Notificaciones, {
        foreignKey: "id_usuario",
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
