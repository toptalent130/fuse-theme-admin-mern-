const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// const passport = require('passport');
const multer = require('multer');
// const path_mo = require('path');
const server_path = "http://localhost:5000/"

const sendEmail = require('../models/send.mail')
const msgs = require('../models/email.msgs')
const { CLIENT_ORIGIN } = require('../config/email_Config')

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateProfileUpdate = require('../validation/profile_update');
const validatePasswordInput = require('../validation/password');
// Load User model
const db = require('../models/index');
const User = db.User;
// @route   POST api/users/register
// @desc    Register user
// @access  Public

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findAll({ where: { email: req.body.email }}).then(user => {
    if (user.length) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });
      let role;
      if(req.body.role === "admin"){
        role = 'admin';
      } else if(req.body.role === "superadmin"){
        role = 'superadmin';
      } else {
        role = 'user';
      }
      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        permission: role
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser).then(nuser => {
            const nuserr = nuser;
            const content = {
              Subject: "Confirm Email",
              HTMLPart: "<a href=\'http://"+CLIENT_ORIGIN+"/confirmed/"+nuserr.id+"\'>Click to confirm email</a>",      
              TextPart: "Copy and paste this link: "+CLIENT_ORIGIN+"/confirm/"+nuserr.id,
              CustomID: "CustomID"
            }
            sendEmail(req.body.email, content).then(()=>{
                res.json({});
              });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/verify_email', (req, res)=>{
  const errors={};
  User.findAll({where: { email: req.body.email }}).then(user => {
    // Check for user
    if (!user.length) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    const userr = user[0].dataValues;
    const content = {
      Subject: "Confirm Email",
      HTMLPart: "<a href=\'http://"+CLIENT_ORIGIN+"/confirmed/"+userr.id+"\'>Click to confirm email</a>",      
      TextPart: "Copy and paste this link: "+CLIENT_ORIGIN+"/confirm/"+userr.id,
      CustomID: "CustomID"
    }
    if (userr && !userr.verified) {
      sendEmail(userr.email, content).then(()=>{
        errors.email_send_state = "Successfully your email sent, Please check in your mail inbox";
        res.status(404).json(errors);
      });
    }

    // The user has already confirmed this email address
    else {
      res.json({ msg: msgs.alreadyConfirmed })
    }
  });
});
router.post('/verify_password', (req, res)=>{
  const errors={};
  User.findAll({where: { email: req.body.email }}).then(user => {
    // Check for user
    if (!user.length) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    const userr = user[0].dataValues;
    const content = {
      Subject: "Confirm Email",
      HTMLPart: "<a href=\'http://"+CLIENT_ORIGIN+"/confirmedpass/"+userr.id+"\'>Click to confirm email</a>",      
      TextPart: "Copy and paste this link: "+CLIENT_ORIGIN+"/confirmpass/"+userr.id,
      CustomID: "CustomID"
    }
    // if (userr.verified) {
      sendEmail(userr.email, content).then(()=>{
        errors.email_sent = true;
        res.status(404).json(errors);
      })
      .catch((err)=>{
        errors.email_sent = false;
        res.status(404).json(errors);
      })
    // }

    // The user has already confirmed this email address
    // else {
    //   errors.email_send_state = false;
    //   res.status(404).json(errors);
    // }
  });
});
router.post('/login', (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);
        // Check Validation
        if (!isValid) {
          return res.status(400).json(errors);
        }
        const email = req.body.email;
        const password = req.body.password;
        // Find user by email
        User.findAll({where: { email: email }}).then(user => {
          // Check for user
          if (!user.length) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
          }
          let userr = user[0].dataValues;
          if(req.body.id > 0){
            User.update({verified:true}, {where: { id: req.body.id }}).then((result)=>{
              userr = result;
            })
          } else {
            if(!userr.verified){
              errors.state_email = "Please verify your email at first";
              return res.status(404).json(errors);
            }
          }
          bcrypt.compare(password, userr.password).then(isMatch => {
            if (isMatch) {
              // User Matched
              const payload = { id: userr.id, email: userr.email, first_name: userr.first_name, last_name: userr.last_name, avatar: userr.avatar, permission: userr.permission, verified: userr.verified }; // Create JWT Payload
              // Sign Token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                }
              );
            } else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
          });
        });
});
router.post('/change_password', (req, res)=>{
  // const { errors, isValid } = validatePasswordInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  User.findAll({where: { id: req.body.id }}).then(user => {
    // Check for user
    if (!user.length) {
      let errors = {};
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    let userr = user[0].dataValues;
    bcrypt.compare(req.body.current_password, userr.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            User.update({password: hash}, {where: { id: req.body.id }}).then((result)=>{
              res.json({
                success: true,
              });
            });
          });
        });
      } else {
        res.json({
          success: false,
        });
      }
    });
  });
});
router.post('/new_password', (req, res)=>{
  const { errors, isValid } = validatePasswordInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) throw err;
      User.update({password: hash}, {where: { id: req.body.id }}).then((result)=>{
        errors.change_pass = "Successfully changed"
        return res.status(404).json(errors);
      });
    });
  });
});
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 2000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

router.post('/update_profile', upload.single('avatar'), (req, res) => {
  const { errors, isValid } = validateProfileUpdate(req.body);
  
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findAll({ where: { email: req.body.email }}).then(user => {
    if (!user.length) {
      return res.status(400).json(errors);
    } else {
      const { first_name, last_name } = req.body;
      const { path } = req.file;
      let avatar_path = server_path + path;

      let userr = user[0].dataValues;
      const payload = { 
        id: userr.id, 
        email: userr.email, 
        first_name: first_name, 
        last_name: last_name, 
        avatar: avatar_path, 
        permission: userr.permission, 
        verified: userr.verified,
      };
      
      User.update({first_name: first_name, last_name: last_name, avatar: avatar_path}, {where: { email: req.body.email }}).then((result)=>{
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              data: {
                first_name: first_name,
                last_name: last_name,
                avatar: avatar_path,
              }
            });
          }
        );
      });
    }
  });
});

router.post('/get_users', (req, res)=>{

  User.findAll({}).then(user => {
    let res1 = [];
    for(let i=0; i<user.length; i++) {
      let one = {
        no: i + 1,
        id: user[i].dataValues.id,
        first_name: user[i].dataValues.first_name,
        last_name: user[i].dataValues.last_name,
        permission: user[i].dataValues.permission,
        email: user[i].dataValues.email,
        avatar: user[i].dataValues.avatar,
      }
      res1.push(one);
    }
    res.json({
      success: true,
      data: res1
    });
  });
});

router.post('/update_user', (req, res) => {
  // const { errors, isValid } = validateProfileUpdate(req.body);
  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  User.findAll({ where: { email: req.body.email }}).then(user => {
    if (!user.length) {
      return res.status(400).json(errors);
    } else {
      let first_name = req.body.first_name;
      let last_name = req.body.last_name;
      let permission = req.body.permission;
      
      User.update(
        {first_name: first_name, last_name: last_name, permission: permission}, 
        {where: { email: req.body.email }}
      ).then((result)=>{
        res.json({
          success: true,
        });
      });
    }
  });
});

router.post('/delete_user', async (req, res) => {
  // const { errors, isValid } = validateProfileUpdate(req.body);
  // // Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  let user = await User.findOne({where: {id: req.body.id}}).catch(e => {
      console.log(e.message)
  })
  if (!user){
    console.log("err");
  }
  user.destroy();
  res.json({
    success: true,
  });
});

router.post('/add_user', (req, res) => {
  User.findAll({ where: { email: req.body.email }}).then(user => {
    if (user.length) {
      res.json({success: false});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });
      
      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        avatar,
        password: 'apple.123',
        permission: req.body.permission,
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser).then(nuser => {
            const nuserr = nuser;
            const content = {
              Subject: "Confirm Email",
              HTMLPart: "<a href=\'http://"+CLIENT_ORIGIN+"/confirmed/"+nuserr.id+"\'>Click to confirm email</a>",      
              TextPart: "Copy and paste this link: "+CLIENT_ORIGIN+"/confirm/"+nuserr.id,
              CustomID: "CustomID"
            }
            sendEmail(req.body.email, content);
            res.json({success: true, data: {avatar: avatar, id: nuserr.dataValues.id}});
            // sendEmail(req.body.email, content).then(()=>{
            //     res.json({success: true, data: {avatar: avatar}});
            //   }).catch(err => {
            //     res.json({success: false, data: {avatar: avatar}});
            //   })
          })
          .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
