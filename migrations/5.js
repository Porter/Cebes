module.exports = {
  description: "Create column email",
  up: (DB) => {
    return DB.makeQuery("ALTER TABLE users ADD COLUMN email varchar(320);");
  },
  down: (DB) => {
    return DB.makeQuery("ALTER TABLE users DROP COLUMN email;");
  }
};