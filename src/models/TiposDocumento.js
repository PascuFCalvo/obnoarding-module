"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TiposDocumento extends Model {
    static associate(models) {
      TiposDocumento.hasMany(models.Documentacion, {
        foreignKey: "tipo_id",
        as: "documentos",
      });
    }
  }

  TiposDocumento.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "TiposDocumento",
      tableName: "TiposDocumento",
      timestamps: true,
    }
  );

  return TiposDocumento;
};
