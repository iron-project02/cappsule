const express   = require(`express`),
      userSites = express.Router(),
      check     = require(`../../helpers/checker`),
      User      = require(`../../models/User`);

userSites.get(`/user/:id`, check.isLogged, check.isUser, (req,res) => {
  User.findById(req.params.id)
      .then(user => {
        let data = {
          title: user.name,
          css:   `profile`
        }
        res.render(`private/profile`, {data, user});
      });
});


module.exports = userSites;