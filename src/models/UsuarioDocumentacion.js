"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioDocumentacion extends Model {
    static associate(models) {
      UsuarioDocumentacion.belongsTo(models.Usuario, {
        foreignKey: "id_usuario", // Asegúrate de que este es el nombre correcto
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
      id_usuario: {
        // Asegúrate de que solo tienes id_usuario
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UsuarioDocumentacion",
      tableName: "UsuarioDocumentacion",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["UsuarioId"] }, // Ignorar el campo aquí
      },
    }
  );

  return UsuarioDocumentacion;
};
