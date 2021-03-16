module.exports = (sequelize, Sequelize) => {
    const App = sequelize.define("App", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      private_key: {
        type: Sequelize.STRING
      },
      appname: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.STRING
      },
      end_time: {
        type: Sequelize.STRING
      },
      app_unique_ping: {
        type: Sequelize.STRING
      },
      last_ping: {
        type: Sequelize.STRING
      },
      reported: {
        type: Sequelize.INTEGER
      }
      
    });
  
    return App;
  };