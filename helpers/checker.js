const User = require(`../models/User`);

exports.isLogged = (req,res,next) => {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login`);
};

exports.isUser = async function checkUser(req,res,next) {
  const user = await User.findById(req.params.id);
  if (user._id.toString() === req.user._id.toString()) {
    req.user = user;
    return next();
  }
  res.redirect(`/auth/login`);
};

exports.isAdmin = (req,res,next) => {
  if (req.user.role === `admin`) return next();
  res.redirect(`/`);
};