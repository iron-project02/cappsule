const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);

searchSites.get(`/search`, check.isLogged, (req,res) => {
  let query = new RegExp(`.*${req.query.name}.*`);
    Product .find({$or : [{name: {$regex: query, $options: `i`}}, {ingredient: {$regex: query, $options: `i`}}]})
            .sort({price: 1})
            .then(products => {
              const {user} = req;
              let data = {
                title: `"${req.query.name}" - Results`,
                css:   `search`,
                js:    `search`
              };
              res.render(`private/search`, {data, user, products});
            });
});

// searchSites.get(`/prod`, check.isLogged, (req,res) => {
//   let query = new RegExp(`.*${req.query.name}.*`);
//   Product .find({$or : [{name: {$regex: query, $options: `i`}}, {ingredient: {$regex: query, $options: `i`}}]})
//           .sort({price: 1})
//           .then(search => {
//             let html = require(`../../helpers/searchHTML`);
//             search.push(html.noResults());
//             search.push(html.productCard());
//             res.json(search)
//           });
// })

searchSites.get(`/prod`, check.isLogged, (req,res) => {
  axios .all([getSanPablo(req), getAhorro(req)])
        .then(axios.spread((FSP, FA) => {
          let obj  = {},
              html = require(`../../helpers/searchHTML`);

          // Data treatment
          obj.SanPablo = sanPabloResults(FSP.data);
          obj.Ahorro   = delAhorroResults(FA.data);

          obj.notfound = html.noResults();
          obj.html     = html.productCard();

          res.json(obj);
        }));
});

searchSites.post(`/prod`, check.isLogged, (req,res) => {
  Product.create()
  console.log(req.body);
});

module.exports = searchSites;
