const express = require('express'),
      router  = express.Router(),
      check   = require(`../helpers/checker`);


/* GET home page */
router.get('/', check.isLogged, (req, res, next) => {
  res.redirect(`/user/${req.user._id}`);
});


module.exports = router;