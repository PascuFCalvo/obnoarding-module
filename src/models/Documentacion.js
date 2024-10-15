"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Documentacion extends Model {
    static associate(models) {
      Documentacion.belongsToMany(models.Usuario, {
        through: models.UsuarioDocumentacion,
        foreignKey: "id_usuario",
        as: "usuarios",
      });
      Documentacion.belongsTo(models.Sociedad, {
        foreignKey: "sociedad_id", // Asegúrate de que este es el nombre correcto
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
      // Añade esto si esperas que la columna exista en la base de datos
      sociedad_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Cambia a false si es obligatorio
      },
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
