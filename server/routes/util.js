
const db = require('../models/index');
const User = db.User;

module.exports = async function getUserNameFromId(id) {
  console.log('function enter');
  let user = await User.findOne({where: {id: id}}).catch(e => {
    console.log('catch message: ', e.message);
    return null;
  })
  if (!user){
    console.log("err");
    return null;
  }
  return user.dataValues.first_name;
}