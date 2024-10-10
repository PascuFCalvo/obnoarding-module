"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Login",
      [
        {
          username: "maria.gomez",
          password: "1234",
          last_login: new Date(),
          is_active: true,
        },
        {
          username: "pedro.lopez",
          password: "1234",
          last_login: new Date(),
          is_active: true,
        },
        {
          username: "laura.ramirez",
          password: "1234",
          last_login: new Date(),
          is_active: true,
        },
        {
          username: "ana.martinez",
          password: "1234",
          last_login: new Date(),
          is_active: true,
        },
        {
          username: "carlos.morales",
          password: "1234",
          last_login: new Date(),
          is_active: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Login", null, {});
  },
};
