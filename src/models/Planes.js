"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Planes extends Model {
    static associate(models) {
      // define association here
    }
  }

  Planes.init(
    {
      Plan: DataTypes.STRING,
      Firmas: DataTypes.INTEGER,
      Documentos: DataTypes.INTEGER,
      Licencias: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Planes",
      tableName: "Planes",
      timestamps: true,
    }
  );

  return Planes;
};
