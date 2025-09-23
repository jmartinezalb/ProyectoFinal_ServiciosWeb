const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Incomes = sequelize.define("Incomes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  tableName: "incomes",
  timestamps: true,
  indexes: [{ fields: ["user_id"] }]
});

module.exports = Incomes;