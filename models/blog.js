'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.belongsTo(models.User, {
        foreignKey:"authorID"
      }),
      Blog.belongsTo(models.Category, {
        foreignKey: "categoryID"
      })
    }
  }
  Blog.init({
    title: DataTypes.STRING,
    authorID: DataTypes.SMALLINT,
    imgURL: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("imgURL");
        if (rawValue) {
          return `${process.env.BASEPATH}${rawValue}`;
        }
        return null;
      }
    },
    categoryID: DataTypes.SMALLINT,
    content: DataTypes.STRING,
    videoURL: DataTypes.STRING,
    keywords: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};