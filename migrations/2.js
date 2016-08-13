module.exports = {
  description: "Add username column",
  up: (DB) => {
    return DB.makeQuery("ALTER TABLE users ADD username varchar(50) NOT NULL UNIQUE;");
  },
  down: (DB) => {
    return DB.makeQuery("ALTER TABLE users DROP username;");
  }
};