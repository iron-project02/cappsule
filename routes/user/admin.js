const express    = require(`express`)
      adminSites = express.Router(),
      check      = require(`../../helpers/checker`),
      User       = require(`../../models/User`),
      Offer      = require(`../../models/Offer`);

adminSites.get(`/admin/:id/search`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.product !== undefined) {
    return User.find({email: `mao@mao.com`}).then(users => res.json(users));
  }
  if (req.query.email !== undefined) {
    let query = new RegExp(`.*${req.query.email}.*`);

    return User.find({email: { $in: [query] } }).then(search => {
      let html = require(`../../helpers/adminHTML`);
      search.push(html.noResults());
      search.push(html.userEditForm());
      res.json(search);
    });
  }
});

adminSites.patch(`/admin/:id/update`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.username !== undefined) {
    return User.findByIdAndUpdate(req.body.userID, {$set: req.body}, {new: true}).then(user => res.json(user));
  }
});

adminSites.delete(`/admin/:id/delete/:user`, check.isLogged, check.isAdmin, (req,res) => {
  return User.findByIdAndDelete(req.params.user).then(user => res.json(user));
});

module.exports = adminSites;