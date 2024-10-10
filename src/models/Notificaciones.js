"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Notificaciones extends Model {
    static associate(models) {
      Notificaciones.belongsTo(models.Usuario, {
        foreignKey: "usuario_id",
        as: "usuario",
      });
      Notificaciones.belongsTo(models.Documentacion, {
        foreignKey: "documento_id",
        as: "documento",
      });
    }
  }

  Notificaciones.init(
    {
      fecha_envio: DataTypes.DATE,
      fecha_entrega: DataTypes.DATE,
      fecha_confirmacion: DataTypes.DATE,
      tipo_notificacion: DataTypes.STRING,
      estado: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notificaciones",
      tableName: "Notificaciones",
      timestamps: true,
    }
  );

  return Notificaciones;
};
