"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DepartamentoDocumentacion", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      departamento_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Departamentos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      documento_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Documentacion",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      acceso: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      firma: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fecha_acceso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_firma: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      firma_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      firma_imagen: {
        type: Sequelize.BLOB,
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
    await queryInterface.dropTable("DepartamentoDocumentacion");
  },
};
