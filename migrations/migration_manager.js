const Promise = require("bluebird");
const requireOptional = require("require-optional");
require("../env");
const DB = require("../helpers/db");

const startAt = parseInt(process.argv[2]);

DB.init();

if (!startAt || isNaN(startAt)) {
  throw new Error(process.argv[2] + " is not a number");
}

var migration = requireOptional("./" + startAt);

function doMigration(migration, number) {
  if (!migration) {
    return Promise.resolve();
  }
  console.log(migration.description);
  return new Promise((resolve, reject) => {
    migration.up(DB)
      .then(result => {
        number++;
        doMigration(requireOptional("./" + number), number).then(resolve).catch(reject);
      })
      .catch(e => { throw e; process.exit(); });
  });
}

doMigration(migration, startAt).then(r => {
  process.exit();
});