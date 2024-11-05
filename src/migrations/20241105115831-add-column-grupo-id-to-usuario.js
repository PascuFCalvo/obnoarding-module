'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuarios', 'grupo_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Grupo',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Usuarios', 'grupo_id');
  }
};
