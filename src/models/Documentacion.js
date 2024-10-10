"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Documentacion extends Model {
    static associate(models) {
      Documentacion.belongsToMany(models.Usuario, {
        through: models.UsuarioDocumentacion,
        foreignKey: "documento_id",
        as: "usuarios",
      });
      Documentacion.belongsTo(models.Sociedad, {
        foreignKey: "sociedad_id",
        as: "sociedad",
      });
    }
  }

  Documentacion.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: DataTypes.TEXT,
      fecha_subida: DataTypes.DATE,
      is_firmado: DataTypes.BOOLEAN,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Documentacion",
      tableName: "Documentacion",
      timestamps: true,
    }
  );

  return Documentacion;
};
