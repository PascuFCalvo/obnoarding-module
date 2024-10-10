"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notificaciones", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Usuarios",
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
      sociedad_id: {
        // Agregando la nueva columna
        type: Sequelize.INTEGER,
        references: {
          model: "sociedad", // Asegúrate de que el nombre coincida con el de tu tabla
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_envio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fecha_entrega: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fecha_confirmacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tipo_notificacion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estado: {
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
    await queryInterface.dropTable("Notificaciones");
  },
};
