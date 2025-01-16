"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioGrupo extends Model {
    static associate(models) {
      UsuarioGrupo.belongsTo(models.Usuario, {
        foreignKey: "id_usuario",
        as: "usuario",
      });
      UsuarioGrupo.belongsTo(models.Grupo, {
        foreignKey: "grupo_id",
        as: "grupo",
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
