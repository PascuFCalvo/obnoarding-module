"use strict";
const { Model, DataTypes } = require("sequelize");


module.exports = (sequelize) => {
  class Sociedad extends Model {
    static associate(models) {
      Sociedad.belongsTo(models.Marca, { foreignKey: "marca_id", as: "marca" });
      Sociedad.hasMany(models.Departamento, {
        foreignKey: "sociedad_id",
        as: "departamentos",
      });
      Sociedad.hasMany(models.Usuario, {
        as: "usuarios", // Alias para referenciar usuarios desde Sociedad
        foreignKey: "sociedad_id", // Campo de clave foránea en Usuario
      });
    }
  }

  Sociedad.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: DataTypes.STRING,
      telefono: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sociedad",
      tableName: "Sociedad",
      timestamps: true,
    }
  );

  return Sociedad;
};
