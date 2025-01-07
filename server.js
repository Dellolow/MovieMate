// Import dependencies
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require('express-session');

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(morgan('dev'));
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(require('./middleware/add-user-to-locals-and-req'));

// Landing page route (#2)
app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'Welcome to MovieMate' });
});

// Movies controller (#4)
app.use('/movies', require('./controllers/movies'));

// Authentication routes
app.use('/auth', require('./controllers/auth'));

// Restrict access to routes below this middleware
app.use(require('./middleware/ensure-signed-in'));

// Start the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
