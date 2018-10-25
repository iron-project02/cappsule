const express   = require(`express`),
      userSites = express.Router(),
      User      = require(`../../models/User`);

userSites.get(`/user/:id`, (req,res) => {
  
  console.log(req.user);
  
  res.send(`ok`);
});


module.exports = userSites;