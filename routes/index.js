const express = require('express'),
      router  = express.Router();

function isLogged(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login`);
}

/* GET home page */
router.get('/', isLogged, (req, res, next) => {
  let data = {
    title: `Home`
  };
  res.render('index', {data});
});

module.exports = router;