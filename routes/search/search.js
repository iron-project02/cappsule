const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxFunc     = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`);

searchSites.get(`/search`, check.isLogged, (req,res) => {
  axios .all([auxFunc.getSanPablo(req.query.name), auxFunc.getAhorro(req.query.name)])
        .then(axios.spread((FSP, FA) => {
          let data = {
                title: `"${req.query.name}" - Results`,
                css:   `search`
              },
              {user} = req,
              obj    = {},
              seaRes = req.query.name;

          // Data treatment
          obj.SanPablo = auxFunc.sanPabloResults(FSP.data);
          obj.Ahorro   = auxFunc.delAhorroResults(FA.data);

          let products = obj.SanPablo.map(item => item);
          obj.Ahorro.forEach(item => products.push(item));
          
          (async function sortProducts(all) {
            all.sort((a,b) => {
              let priceA = parseFloat(a.price),
                  priceB = parseFloat(b.price);
              return priceA - priceB;
            });
            await res.render(`private/search`, {data, user, seaRes, products, obj});
          })(products);
        }));
});


module.exports = searchSites;