const express = require('express');
const router = express.Router();

// Load Robot model
const db = require('../models/index');
const Robot = db.Robot;
const User = db.User;

router.post('/get_robots', (req, res)=>{
  if(req.body.id < 0) {
    Robot.findAll({}).then((robot) => {
      let robots = robot.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          active: ele.dataValues.active,
          manager_id: ele.dataValues.manager_id,
          description: ele.dataValues.description,
        }
        return one;
      });
      User.findAll({}).then((user) => {
        let users = user.map((ele) => {
          return {first_name: ele.dataValues.first_name, id: ele.dataValues.id}
        });
        res.json({
          success: true,
          robots: robots,
          users: users,
        });
      })
    });
  } else {
    Robot.findAll({where: {manager_id: req.body.id}}).then((robot) => {
      let robots = robot.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          active: ele.dataValues.active,
          manager_id: ele.dataValues.manager_id,
          description: ele.dataValues.description,
        }
        return one;
      });
      User.findAll({where: {id: req.body.id}}).then((user) => {
        let users = user.map((ele) => {
          return {first_name: ele.dataValues.first_name, id: ele.dataValues.id}
        });
        res.json({
          success: true,
          robots: robots,
          users: users,
        });
      })
    });
  }
});

router.post('/update_robot', (req, res) => {
  Robot.findAll({ where: { id: req.body.id }}).then(robot => {
    if (!robot.length) {
      return res.status(400).json(errors);
    } else {
      let status = req.body.active === 'active' ? 1 : 0;
      let active = status;
      let manager_id = req.body.manager_id;
      let description = req.body.description;
      
      Robot.update(
        {active: active, manager_id: manager_id, description: description}, 
        {where: { id: req.body.id }}
      ).then((result)=>{
        res.json({
          success: true,
        });
      });
    }
  });
});

router.post('/delete_robot', async (req, res) => {
  let robot = await Robot.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message);
  })
  if (!robot){
    console.log("err");
  }
  robot.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_robot', (req, res) => {
  let status = req.body.active === 'active' ? 1 : 0;
  const newRobot = {
    active: status,
    manager_id: req.body.manager_id,
    description: req.body.description,
  };
  Robot.create(newRobot).then(nrobot => {
    if(nrobot)
      res.json({success: true, id: nrobot.dataValues.id});
  })
  .catch(err => console.log(err));
});

module.exports = router;
