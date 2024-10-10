"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioDocumentacion extends Model {
    static associate(models) {
      UsuarioDocumentacion.belongsTo(models.Usuario, {
        foreignKey: "usuario_id",
        as: "usuario",
      });
      UsuarioDocumentacion.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
    }
  }

  UsuarioDocumentacion.init(
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
      modelName: "UsuarioDocumentacion",
      tableName: "UsuarioDocumentacion",
      timestamps: true,
    }
  );

  return UsuarioDocumentacion;
};
