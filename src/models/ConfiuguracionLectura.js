"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ConfiguracionLectura extends Model {
    static associate(models) {
      ConfiguracionLectura.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
    }
  }

  ConfiguracionLectura.init(
    {
      tiempo_minimo_segundos: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ConfiguracionLectura",
      tableName: "ConfiguracionLectura",
      timestamps: true,
    }
  );

  return ConfiguracionLectura;
};
