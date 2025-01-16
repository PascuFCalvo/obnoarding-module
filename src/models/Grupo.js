"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Grupo extends Model {
    static associate(models) {
      Grupo.belongsToMany(models.Usuario, {
        through: models.UsuarioGrupo,
        foreignKey: "grupo_id",
        otherKey: "id_usuario",
        as: "usuariosDelGrupo", // Alias único
      });

      Grupo.belongsTo(models.Departamento, {
        foreignKey: "departamento_id",
        as: "departamento",
      });
    }
  }

  Grupo.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Grupo",
      tableName: "Grupo",
      timestamps: true,
    }
  );

  return Grupo;
};
