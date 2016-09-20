const sequelizeHelper = require("./sequelize_helper");
const Promise = require("bluebird");

const sequelizedConnection = sequelizeHelper.getSequelizedConnection();
const Sequelize = sequelizeHelper.getSequelize();


const User = sequelizedConnection.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  passhash: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});

User.init = () => {
  return User.sync();
}


module.exports = User;
