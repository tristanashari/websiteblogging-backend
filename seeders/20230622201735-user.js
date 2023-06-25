'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("Users", [
    {
      email: "timoc@gmail.com",
      username: "timocruz",
      phoneNumber: "123456789",
      password: "TimoCruz01",
      isVerified: true
    },
    {
      email: "worm@gmail.com",
      username: "wormpg",
      phoneNumber: "125034509",
      password: "MrWormFor3",
      isVerified: false
    },
    {
      email: "damiencarter@gmail.com",
      username: "dametime",
      phoneNumber: "589479832",
      password: "DamienCarter0",
      isVerified: true
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, [])
  }
};
