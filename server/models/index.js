const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User.js")(sequelize, Sequelize);
db.Plan = require("./Plan.js")(sequelize, Sequelize);
db.Robot = require("./Robot.js")(sequelize, Sequelize);
db.Server = require("./Server.js")(sequelize, Sequelize);
db.App = require("./App.js")(sequelize, Sequelize);
db.Trading = require("./Trading.js")(sequelize, Sequelize);

module.exports = db;