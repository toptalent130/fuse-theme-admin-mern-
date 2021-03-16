const express = require('express');
const router = express.Router();

// Load Plan model
const db = require('../models/index');
const Plan = db.Plan;
const User = db.User;

router.post('/get_plans', (req, res)=>{
  if(req.body.id < 0) {
    Plan.findAll({}).then((plan) => {
      let plans = plan.map((ele, i) => {
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
          plans: plans,
          users: users,
        });
      })
    });
  } else {
    Plan.findAll({where: {manager_id: req.body.id}}).then((plan) => {
      let plans = plan.map((ele, i) => {
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
          plans: plans,
          users: users,
        });
      })
    });
  }
});

router.post('/update_plan', (req, res) => {
  Plan.findAll({ where: { id: req.body.id }}).then(plan => {
    if (!plan.length) {
      return res.status(400).json(errors);
    } else {
      let status = req.body.active;
      let active = status;
      let manager_id = req.body.manager_id;
      let description = req.body.description;
      
      Plan.update(
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

router.post('/delete_plan', async (req, res) => {
  let plan = await Plan.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message);
  })
  if (!plan){
    console.log("err");
  }
  plan.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_plan', (req, res) => {
  let status = req.body.active;
  const newPlan = {
    active: status,
    manager_id: req.body.manager_id,
    description: req.body.description,
  };
  Plan.create(newPlan).then(nplan => {
    if(nplan)
      res.json({success: true, id: nplan.dataValues.id});
  })
  .catch(err => console.log(err));
});

module.exports = router;
