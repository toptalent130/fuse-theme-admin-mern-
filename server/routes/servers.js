// const { faHourglassEnd } = require('@fortawesome/free-solid-svg-icons');
const express = require('express');
const router = express.Router();

// Load Server model
const db = require('../models/index');
const Server = db.Server;
const User = db.User;

router.post('/get_servers', (req, res)=>{
  if(req.body.id < 0) {
    Server.findAll({}).then((server) => {
      let servers = server.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          user_id: ele.dataValues.user_id,
          server_ip: ele.dataValues.server_ip,
          start_time: ele.dataValues.start_time,
          end_time: ele.dataValues.end_time,
          auto_renew: ele.dataValues.auto_renew,
          comment: ele.dataValues.comment,
        }
        return one;
      });
      User.findAll({}).then((user) => {
        let users = user.map((ele) => {
          return {first_name: ele.dataValues.first_name, id: ele.dataValues.id}
        });
        res.json({
          success: true,
          servers: servers,
          users: users,
        });
      })
    });
  } else {
    Server.findAll({where: {user_id: req.body.id}}).then((server) => {
      let servers = server.map((ele, i) => {
        let one = {
          no: i + 1,
          id: ele.dataValues.id,
          user_id: ele.dataValues.user_id,
          server_ip: ele.dataValues.server_ip,
          start_time: ele.dataValues.start_time,
          end_time: ele.dataValues.end_time,
          auto_renew: ele.dataValues.auto_renew,
          comment: ele.dataValues.comment,
        }
        return one;
      });
      User.findAll({where: {id: req.body.id}}).then((user) => {
        let users = user.map((ele) => {
          return {first_name: ele.dataValues.first_name, id: ele.dataValues.id}
        });
        res.json({
          success: true,
          servers: servers,
          users: users,
        });
      })
    });
  }
});

router.post('/update_server', (req, res) => {
  Server.findAll({ where: { id: req.body.id }}).then(server => {
    if (!server.length) {
      return res.status(400).json(errors);
    } else {
      
      Server.update(
        req.body, 
        {where: { id: req.body.id }}
      ).then((result)=>{
        if(result) {
          Server.findAll({where: {id: req.body.id}}).then(rlt => {
            res.json({
              success: true,
              start_time: rlt[0].dataValues.start_time,
              end_time: rlt[0].dataValues.end_time,
            })
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

router.post('/delete_server', async (req, res) => {
  let server = await Server.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message);
  })
  if (!server){
    console.log("err");
  }
  server.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_server', (req, res) => {
  const newServer = {
    user_id: req.body.user_id,
    server_ip: req.body.server_ip,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    auto_renew: req.body.auto_renew,
    comment: req.body.comment,
  };
  Server.create(newServer).then(nserver => {
    if(nserver) {
      Server.findAll({where: {id: nserver.dataValues.id}}).then(rlt => {
        if(rlt) {
          res.json({
            success: true,
            id: rlt[0].dataValues.id,
            start_time: rlt[0].dataValues.start_time,
            end_time: rlt[0].dataValues.end_time,
          })
        }
      }).catch(err => {
        res.json({
          success: false,
          error: err,
        })
      })
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;
