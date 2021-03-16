const express = require('express');
const router = express.Router();

// Load TradingLicense model
const db = require('../models/index');
const Trading = db.Trading;
const User = db.User;
const Plan = db.Plan;
const Robot = db.Robot;


router.post('/get_tradings', (req, res)=>{
  if(req.body.id < 0) {
    Trading.findAll({}).then((trading) => {
      let tradings = trading.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          manager_id: ele.dataValues.manager_id,
          plan_id: ele.dataValues.plan_id,
          robot_id: ele.dataValues.robot_id,
          account_number: ele.dataValues.account_number,
          created_time: ele.dataValues.created_time,
          canceled_time: ele.dataValues.canceled_time,
        }
        return one;
      });
      User.findAll({}).then((user) => {
        Robot.findAll({}).then((robot) => {
          Plan.findAll({}).then((plan) => {
            res.json({
              success: true,
              tradings: tradings,
              users: user,
              robots: robot,
              plans: plan,
            });
          })
        })
      })
    });
  } else {
    Trading.findAll({where: {manager_id: req.body.id}}).then((trading) => {
      let tradings = trading.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          manager_id: ele.dataValues.manager_id,
          plan_id: ele.dataValues.plan_id,
          robot_id: ele.dataValues.robot_id,
          account_number: ele.dataValues.account_number,
          created_time: ele.dataValues.created_time,
          canceled_time: ele.dataValues.canceled_time,
        }
        return one;
      });
      User.findAll({where: {id: req.body.id}}).then((user) => {
        Robot.findAll({}).then((robot) => {
          Plan.findAll({}).then((plan) => {
            res.json({
              success: true,
              tradings: tradings,
              users: user,
              robots: robot,
              plans: plan,
            });
          })
        })
      })
    });
  }
});

router.post('/update_trading', (req, res) => {
  Trading.findAll({ where: { id: req.body.id }}).then(trading => {
    if (!trading.length) {
      return res.status(400).json(errors);
    } else 
      {
      Trading.update(
        req.body,
        {where: { id: req.body.id }}
      ).then((result)=>{
          if(result){
            Trading.findAll({ where: { id: req.body.id }}).then(trading => {
              res.json({
                  success:true,
                  created_time: trading[0].dataValues.created_time,
                  canceled_time: trading[0].dataValues.canceled_time,
              });

            });

          } else {
            res.json({
              success: false,
            });
          }
      });
    }
  });
});

router.post('/delete_trading', async (req, res) => {
  let trading = await Trading.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message);
  })
  if (!trading){
    console.log("err");
  }
  trading.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_trading', (req, res) => {
  const newTrading = {
    manager_id: req.body.manager_id,
    plan_id: req.body.plan_id,
    robot_id: req.body.robot_id,
    account_number: req.body.account_number,
    created_time: req.body.created_time,
    canceled_time: req.body.canceled_time,
  };
  Trading.create(newTrading).then(ntrading => {
    if(ntrading) {
      Trading.findAll({where: {id: ntrading.dataValues.id}}).then(rlt => {
        res.json({
          success: true, 
          id: rlt[0].dataValues.id,
          created_time: rlt[0].dataValues.created_time, 
          canceled_time: rlt[0].dataValues.canceled_time
        });
      })
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;
