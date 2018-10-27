const express   = require('express'),
      remSites  = express.Router(),
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`);

remSites.get(`/user/:id/reminders`, check.isLogged, check.isUser, (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            res.render(`private/reminder`, {user})
        });
});


module.exports = remSites;