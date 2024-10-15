"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioGrupo extends Model {
    static associate(models) {
      // Definir alias únicos para evitar conflictos
      models.Usuario.belongsToMany(models.Grupo, {
        through: UsuarioGrupo,
        foreignKey: "id_usuario",
        otherKey: "grupo_id",
        as: "gruposAsociados", // Cambia este alias a algo único
      });
      models.Grupo.belongsToMany(models.Usuario, {
        through: UsuarioGrupo,
        foreignKey: "grupo_id",
        otherKey: "id_usuario",
        as: "usuariosAsociados", // Cambia este alias a algo único
      });
    }
  }

  UsuarioGrupo.init(
    {
      // Define campos adicionales aquí si los hay
    },
    {
      sequelize,
      modelName: "UsuarioGrupo",
      tableName: "UsuarioGrupo",
      timestamps: true,
    }
  );

  return UsuarioGrupo;
};
