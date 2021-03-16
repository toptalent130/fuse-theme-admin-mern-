const express = require('express');
const router = express.Router();

// Load App model
const db = require('../models/index');
const App = db.App;

router.post('/get_apps', (req, res)=>{

  App.findAll({}).then((app) => {
    let rlt = app.map((ele, i) => {
      return {...ele.dataValues, no: i+1};
    })
    res.json({
      success: true,
      apps: rlt,
    });
  });
});

router.post('/update_app', (req, res) => {
  App.findAll({ where: { id: req.body.id }}).then(app => {
    if (!app.length) {
      return res.status(400).json(errors);
    } else {
      App.update(
        req.body, 
        {where: { id: req.body.id }}
      ).then((result)=>{
        if(result) {
          App.findAll({where: {id: req.body.id}}).then(rlt => {
            res.json({
              success: true,
              start_time: rlt[0].dataValues.start_time,
              last_ping: rlt[0].dataValues.last_ping,
              end_time: rlt[0].dataValues.end_time,
            });
          }).catch(err => {
            res.json({
              success: false,
              error: err,
            })
          })
        }
      });
    }
  });
});

router.post('/delete_app', async (req, res) => {
  let app = await App.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message);
  })
  if (!app){
    console.log("err");
  }
  app.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_app', (req, res) => {
  const newApp = {
    appname: req.body.appname,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    app_unique_ping: req.body.app_unique_ping,
    last_ping: req.body.last_ping,
    reported: req.body.reported,
  };
  App.create(newApp).then(napp => {
    if(napp) {
      App.findAll({where: {id: napp.dataValues.id}}).then(rlt => {
        res.json({
          success: true,
          id: rlt[0].dataValues.id,
          start_time: rlt[0].dataValues.start_time,
          last_ping: rlt[0].dataValues.last_ping,
          end_time: rlt[0].dataValues.end_time,
        })
      })
    }
  })
  .catch(err => {
    res.json({
      success: false,
      error: err,
    })
  });
});

module.exports = router;
