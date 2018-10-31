const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      Product     = require(`../../models/Product`);

searchSites.get(`/search`, check.isLogged, (req,res) => {
  if (req.query.name === undefined) res.redirect(`/`);
  let query = new RegExp(`.*${req.query.name}.*`);
    Product .find({name: { $in: [query] } })
            .then(products => {
              const {user} = req;
              let data = {
                title: `"${req.query.name}" - Results`,
                css:   `search`
              };
              res.render(`private/search`, {data, user, products});
            });
});

module.exports = searchSites;