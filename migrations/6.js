module.exports = {
  description: "Make emails unique",
  up: (DB) => {
    return DB.makeQuery("ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);");
  },
  down: (DB) => {
    return DB.makeQuery("ALTER TABLE users DROM CONSTRAINT unique_email;");
  }
};