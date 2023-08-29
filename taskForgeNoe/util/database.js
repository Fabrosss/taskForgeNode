const Sequelize = require('sequelize');

const sequelize = new Sequelize('taskForge', 'root', 'admin', {
  dialect: 'mysql',
  host: 'localhost',
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
