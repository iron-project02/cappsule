const express = require('express'),
      router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let data = {
    title: `Home`
  };
  res.render('index', {data});
});

module.exports = router;