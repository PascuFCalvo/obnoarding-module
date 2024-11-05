"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UsuarioDepartamento extends Model {
    static associate(models) {
      // Definir alias únicos para evitar conflictos
      models.Usuario.belongsToMany(models.Departamento, {
        through: UsuarioDepartamento,
        foreignKey: "id_usuario",
        otherKey: "grupo_id",
        as: "departamentosAsociados", // Cambia este alias a algo único
      });
      models.Departamento.belongsToMany(models.Usuario, {
        through: UsuarioDepartamento,
        foreignKey: "departamento_id",
        otherKey: "id_usuario",
        as: "usuariosAsociados", // Cambia este alias a algo único
      });
    }
  }

  UsuarioDepartamento.init(
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Usuario",
          key: "id",
        },
      },
      departamento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Departamento",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UsuarioDepartamento",
      tableName: "UsuarioDepartamento",
      timestamps: true,
    }
  );

  return UsuarioDepartamento;
};
