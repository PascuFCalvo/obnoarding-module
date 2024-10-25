"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioDocumentacion extends Model {
    static associate(models) {
      UsuarioDocumentacion.belongsTo(models.Usuario, {
        foreignKey: "id_usuario",
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
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios", // Asegúrate de que coincide con el nombre de la tabla de usuarios
          key: "id",
        },
      },
      documento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Documentacion", // Asegúrate de que coincide con el nombre de la tabla de documentación
          key: "id",
        },
      },
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
        allowNull: true,
      },
      firma_imagen: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser nulo hasta que se genere la URL
      },
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
