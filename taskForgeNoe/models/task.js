const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  topic: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hours: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  startingDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  endingDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
},{
  timestamps: false
});

module.exports = Task;
