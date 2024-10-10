"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsuarioRoles", {
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
        onDelete: "CASCADE",
      },
      rol_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("UsuarioRoles");
  },
};
