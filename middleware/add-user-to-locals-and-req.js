const User = require("../models/user");

module.exports = async function (req, res, next) {
  try {
    if (req.session.user_id) {
      req.user = await User.findById(req.session.user_id);
    } else {
      req.user = null;
    }
    res.locals.user = req.user;
    next();
  } catch (err) {
    console.error("Error in add-user-to-locals-and-req:", err);
    next(err);
  }
};
