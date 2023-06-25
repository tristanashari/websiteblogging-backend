'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      authorID: {
        type: Sequelize.SMALLINT,
        references: {
          model: "Users",
          key: "id"
        }
      },
      imgURL: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      categoryID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id"
        }
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      videoURL: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      keywords: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Blogs');
  }
};