const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load Robot model
const db = require('../models/index');
const Robot = db.Robot;
const User = db.User;
const generateKey = (value) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(value, salt, (err, hash) => {
            console.log(hash);
        });
    });
}
router.post('/get_all_users', (req, res)=>{
    // generateKey('tomerid');
    // generateKey('tomersite');
    User.findAll().then((users)=>{
        if((req.headers['app-id'].indexOf('$2a$10$0fNB95YdPCLz8VDxcZz3yOuuZBpfNVK2B6fK1gZNVtC26X7OxQKF6')>=0)&&(req.headers['app-secret'].indexOf('$2a$10$bq2yH2hKELmreWJQhgElfulQbONNaOV9IYjh4fPJ6NWcsnvVZnpxC')>=0)){
            res.json(users)
        } else {
            res.json({errors:"null"});
        }
    })
});
module.exports = router;
