const editHelper = require("../helpers/edit_helper");
const DBError = require("../errors/db_error");
const sequelizeHelper = require("./sequelize_helper");
const Promise = require("bluebird");
const _ = require("lodash");

const sequelizedConnection = sequelizeHelper.getSequelizedConnection();
const Sequelize = sequelizeHelper.getSequelize();

const Document = sequelizedConnection.define('documents', {
  text: {
    type: Sequelize.TEXT,
    defaultValue: ""
  },
  history: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});


Document.init = () => {
  return Document.sync();
}

module.exports = Document;
