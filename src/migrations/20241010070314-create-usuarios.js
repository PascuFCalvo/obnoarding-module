"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Usuarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      login_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Login",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      marca_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Marca",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sociedad_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Sociedad",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Usuarios");
  },
};
