// Sample app.
const express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

require('dotenv').config();

const apiRoutes = require('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('MongoDB connection established.');
  }
);
// const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// mongoose.connect(dbUrl, { autoIndex: false });
// console.log(mongoose.connection);

const PORT = process.env.port || 3000;

// Message for default route.
app.get('/', function(req, res) {
  res.send('Welcome! It works!');
});

app.listen(PORT, function() {
  console.log('Server has started on port ' + PORT);
});
