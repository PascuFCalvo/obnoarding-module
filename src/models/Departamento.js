"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Departamento extends Model {
    static associate(models) {
      Departamento.belongsTo(models.Sociedad, {
        foreignKey: "sociedad_id",
        as: "sociedad",
      });
      Departamento.hasMany(models.Grupo, {
        foreignKey: "departamento_id",
        as: "grupos",
      });
    }
  }

  Departamento.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Departamento",
      tableName: "Departamentos",
      timestamps: true,
    }
  );

  return Departamento;
};
