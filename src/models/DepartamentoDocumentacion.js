"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class DepartamentoDocumentacion extends Model {
    static associate(models) {
      DepartamentoDocumentacion.belongsTo(models.Departamento, {
        foreignKey: "departamento_id",
        as: "departamento",
      });
      DepartamentoDocumentacion.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
    }
  }

  DepartamentoDocumentacion.init(
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
      modelName: "DepartamentoDocumentacion",
      tableName: "DepartamentoDocumentacion",
      timestamps: true,
      hooks: {
        beforeUpdate: (departamentoDocumentacion) => {
          if (departamentoDocumentacion.firma) {
            departamentoDocumentacion.fecha_firma = new Date();
          }
        },
      },
    }
  );

  return DepartamentoDocumentacion;
};
