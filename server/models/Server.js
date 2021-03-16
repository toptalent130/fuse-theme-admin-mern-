module.exports = (sequelize, Sequelize) => {
    const Server = sequelize.define("Server", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      server_ip: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.STRING
      },
      end_time: {
        type: Sequelize.STRING
      },
      auto_renew: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      }
    });
  
    return Server;
  };