const express = require('express'),
      router  = express.Router(),
      User    = require(`../models/User`);

function isLogged(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login`);
}

/* GET home page */
router.get('/', isLogged, (req, res, next) => {
  res.redirect(`/user/${req.user._id}`);
});


module.exports = router;