const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      Product     = require(`../../models/Product`);

searchSites.get(`/search`, check.isLogged, (req,res) => {
  let query = new RegExp(`.*${req.query.name}.*`);
    Product .find({name: { $in: [query] } })
            .then(products => {
              let data = {
                title: `"${req.query.name}" - Results`,
                css:   `search`
              };
              res.render(`private/search`, {data, products});
            });
});

module.exports = searchSites;