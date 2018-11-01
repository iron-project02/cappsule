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

function getSanPablo(req,res) {
  return axios.get(`https://farmaciasanpablo.com.mx/search/?text=${req.query.name}`);
}

function getAhorro(req,res) {
  let query = new RegExp(`.*${req.query.name}.*`);
  return axios.get(`http://www.fahorro.com/catalogsearch/result/?q=${req.query.name}`);
}
searchSites.get(`/prod`, check.isLogged, (req,res) => {
  
  axios .all([getSanPablo(req,res), getAhorro(req,res)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          obj.SanPablo = FSP.data;
          obj.Ahorro   = FA.data;
          res.json(obj);
        }));
})

module.exports = searchSites;