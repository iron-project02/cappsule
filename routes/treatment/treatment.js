const express   = require('express'),
      treaSites = express.Router();
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`);

treaSites.get(`/user/:id/treatments`, check.isLogged, check.isUser, (req, res) => {
User.findById(req.params.id)
    .then(user => {
        res.render(`private/treatment`, {user})
    });
});

module.exports = treaSites;