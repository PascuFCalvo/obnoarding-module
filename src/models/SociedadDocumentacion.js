"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class SociedadDocumentacion extends Model {
    static associate(models) {
      SociedadDocumentacion.belongsTo(models.Sociedad, {
        foreignKey: "sociedad_id",
        as: "sociedad",
      });
      SociedadDocumentacion.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documentacion",
      });
    }
  }

  SociedadDocumentacion.init(
    {
      acceso: DataTypes.BOOLEAN,
      firma: DataTypes.BOOLEAN,
      fecha_acceso: DataTypes.DATE,
      fecha_firma: DataTypes.DATE,
      firma_uuid: DataTypes.UUID,
      firma_imagen: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: "SociedadDocumentacion",
      tableName: "SociedadDocumentacion",
      timestamps: true,
    }
  );

  return SociedadDocumentacion;
};
