const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./models/index');
const path = require('path');
// db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//   require('./models/seed');
// });

const users = require('./routes/users');
const plans = require('./routes/plans');
const robots = require('./routes/robots');
const servers = require('./routes/servers');
const apps = require('./routes/apps');
const tradings = require('./routes/tradings');
const app = express();
//for only owner
const secret = require('./routes/secret');

// var corsOptions = {
//   origin: "http://localhost:3000"
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use('/files', express.static(path.join(__dirname, 'files')));

// simple route
app.use('/api/users', users);
app.use('/api/plans', plans);
app.use('/api/robots', robots);
app.use('/api/servers', servers);
app.use('/api/apps', apps);
app.use('/api/tradings', tradings);
app.use('/api/owner', secret);
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
