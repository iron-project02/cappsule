const express      = require(`express`),
      offersRoutes = express.Router(),
      check        = require(`../helpers/checker`),
      Offer        = require(`../models/Offer`);

offersRoutes.get(`/offers`, check.isLogged, (req,res) => {
  let data = {
        title: `Special Deals`,
        css:   `offers`
      },
      {user} = req;
  Offer .find()
        .populate(`productId`)
        .populate(`pharmacyId`)
        .then(offers => res.render(`private/offers`, {user, data, offers}));
});

module.exports = offersRoutes;