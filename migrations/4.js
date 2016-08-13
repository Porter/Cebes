module.exports = {
  description: "Create column password",
  up: (DB) => {
    return DB.makeQuery("ALTER TABLE users ADD COLUMN passhash varchar(60) NOT NULL;");
  },
  down: (DB) => {
    return DB.makeQuery("ALTER TABLE users DROP COLUMN passhash;");
  }
};