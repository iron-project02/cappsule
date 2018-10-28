const express    = require(`express`)
      adminSites = express.Router(),
      User       = require(`../../models/User`),
      Offer      = require(`../../models/Offer`);

adminSites.get(`/admin/:id/search`, (req,res) => {
  if (req.query.product !== undefined) {
    return User.find({email: `mao@mao.com`}).then(users => res.json(users));
  }
  if (req.query.email !== undefined) {
    let query = new RegExp(`.*${req.query.email}.*`);
    return User.find({email: { $in: [query] } }).then(search => res.json(search));
  }
});

module.exports = adminSites;