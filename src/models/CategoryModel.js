const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  catname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  desc: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
  tableName: "category",
  timestamps: true,
  indexes: [{ fields: ["user_id"] }]
});

module.exports = Category;
