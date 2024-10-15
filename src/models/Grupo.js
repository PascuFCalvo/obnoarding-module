"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Grupo extends Model {
    static associate(models) {
      Grupo.belongsTo(models.Departamento, {
        foreignKey: "departamento_id",
        as: "departamento",
      });
      Grupo.hasMany(models.Usuario, { foreignKey: "grupo_id", as: "usuarios" });
     
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
