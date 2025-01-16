"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Grupo, {
        through: models.UsuarioGrupo,
        foreignKey: "id_usuario",
        otherKey: "grupo_id",
        as: "gruposDeUsuario", // Alias único
      });

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

      Usuario.belongsTo(models.Sociedad, {
        as: "sociedad",
        foreignKey: "sociedad_id",
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
