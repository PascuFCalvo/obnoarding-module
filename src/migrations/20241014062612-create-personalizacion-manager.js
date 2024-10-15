"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PersonalizacionManager", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      color_primario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color_secundario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color_acento_primario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color_acento_secundario: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fuente: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tamano_fuente: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SociedadDocumentacion");
  },
};
