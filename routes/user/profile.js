const express   = require(`express`),
      userSites = express.Router(),
      User      = require(`../../models/User`);

userSites.get(`/user/:id`, (req,res) => {
  User.findById(req.params.id)
      .then(user => {
        res.send(`ok`);
      });
});


module.exports = userSites;