module.exports = (sequelize, Sequelize) => {
    const Trading = sequelize.define("Trading", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      manager_id: {
        type: Sequelize.INTEGER
      },
      plan_id: {
        type: Sequelize.INTEGER
      },
      robot_id: {
        type: Sequelize.INTEGER
      },
      account_number: {
        type: Sequelize.INTEGER
      },
      created_time: {
        type: Sequelize.STRING
      },
      canceled_time: {
        type: Sequelize.STRING
      }
    });
  
    return Trading;
  };