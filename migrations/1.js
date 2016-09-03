module.exports = {
  description: "Create table users",
  up: (DB) => {
    return DB.makeQuery("CREATE TABLE users();");
  },
  down: (DB) => {
    return DB.makeQuery("DROP TABLE users;");
  }
};