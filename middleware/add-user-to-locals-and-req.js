console.log(__dirname); // Add this at the top of add-user-to-locals-and-req.js

const User = require('../models/user');

module.exports = async function (req, res, next) {
  // You can now access the logged in user's document in every controller function
  req.user = req.session.user_id ? await User.findById(req.session.user_id) : null;
  // Add to locals object so that use can be accessed in the templates
  res.locals.user = req.user;
  next();
};