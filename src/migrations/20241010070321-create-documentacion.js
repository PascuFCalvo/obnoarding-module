"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Documentacion", {
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
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fecha_subida: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_firmado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tipo_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "TiposDocumento",
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
    await queryInterface.dropTable("Documentacion");
  },
};
