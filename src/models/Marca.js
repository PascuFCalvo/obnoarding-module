"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Marca extends Model {
    static associate(models) {
      Marca.hasMany(models.Sociedad, {
        foreignKey: "marca_id",
        as: "sociedades",
      });
    }
  }

  Marca.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Marca",
      tableName: "Marcas",
      timestamps: true,
    }
  );

  return Marca;
};
