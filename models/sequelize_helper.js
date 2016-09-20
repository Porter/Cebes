const requireOptional = require("require-optional");
requireOptional("../env.js")
const Sequelize = require("sequelize");

const database = process.env.PGDATABASE;
const user = process.env.PGUSER;
const password = process.env.PGPASSWORD;

var sequelize = new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: function (str) { }
});

module.exports = {
  getSequelizedConnection: () => { return sequelize; },
  getSequelize: () => { return Sequelize; },
};
