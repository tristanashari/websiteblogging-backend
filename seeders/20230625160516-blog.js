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
   await queryInterface.bulkInsert("Blogs", [
    {
      title: "first blog",
      authorID: 1,
      categoryID: 2,
      content:"lorem ipsum al",
      country: "Indonesia"
    },
    {
      title: "second blog",
      authorID: 2,
      categoryID: 3,
      content:"lorem ipsum als",
      country: "Singapore"
    },
    {
      title: "third blog",
      authorID: 3,
      categoryID: 6,
      content:"lorem ipsum alt",
      country: "Indonesia"
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Blogs", null, {})
  }
};
