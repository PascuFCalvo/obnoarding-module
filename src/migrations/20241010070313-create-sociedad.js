"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sociedad", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("Sociedad");
  },
};
