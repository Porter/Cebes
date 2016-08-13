module.exports = {
  description: "Create id",
  up: (DB) => {
    return DB.makeQuery("ALTER TABLE users ADD COLUMN id BIGSERIAL PRIMARY KEY;");
  },
  down: (DB) => {
    return DB.makeQuery("ALTER TABLE users DROP COLUMN id;");
  }
};