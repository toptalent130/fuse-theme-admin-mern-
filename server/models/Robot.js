module.exports = (sequelize, Sequelize) => {
    const Robot = sequelize.define("Robot", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      active: {
        type: Sequelize.STRING
      },
      manager_id: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    });
  
    return Robot;
  };