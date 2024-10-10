"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class DependenciasDocumento extends Model {
    static associate(models) {
      DependenciasDocumento.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
      DependenciasDocumento.belongsTo(models.Documentacion, {
        foreignKey: "documento_predecesor_id",
        as: "documento_predecesor",
      });
    }
  }

  DependenciasDocumento.init(
    {},
    {
      sequelize,
      modelName: "DependenciasDocumento",
      tableName: "DependenciasDocumento",
      timestamps: true,
    }
  );

  return DependenciasDocumento;
};
