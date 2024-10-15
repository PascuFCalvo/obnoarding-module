"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class GrupoDocumentacion extends Model {
    static associate(models) {
      GrupoDocumentacion.belongsTo(models.Grupo, {
        foreignKey: "grupo_id",
        as: "grupo",
      });
      GrupoDocumentacion.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
    }
  }

  GrupoDocumentacion.init(
    {
      acceso: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      firma: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fecha_acceso: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fecha_firma: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      firma_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firma_imagen: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "GrupoDocumentacion",
      tableName: "GrupoDocumentacion",
      timestamps: true,
      hooks: {
        beforeUpdate: (grupoDocumentacion) => {
          if (grupoDocumentacion.firma) {
            grupoDocumentacion.fecha_firma = new Date();
          }
        },
      },
    }
  );

  return GrupoDocumentacion;
};
