"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Personalizacion extends Model {
    static associate(models) {
      Personalizacion.belongsTo(models.Sociedad, {
        foreignKey: "id",
        as: "sociedad",
      });
     
    }
  }

  Personalizacion.init(
    {
      color_primario: {
        type: DataTypes.STRING,
        allowNull: true,
      },
        color_secundario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color_acento_primario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color_acento_secundario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fuente: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tamano_fuente: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
    },
    {
      sequelize,
      modelName: "PersonalizacionManager    ",
      tableName: "PersonalizacionManager",
      timestamps: true,
    }
  );

  return Personalizacion;
};
