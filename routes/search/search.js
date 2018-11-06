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





function delAhorroResults(data) {
  let FDAArray = [];

  // Farmacia del Ahorro Drugstore search results identification
  if (data.indexOf(`Resultados de la búsqueda`) > 0) {
    let fdaSearchProducts = `<h2 class="product-name"><a href="`,
        fdaItemIndex      = indexString(fdaSearchProducts,data);
    console.log(`=> Del Ahorro results:\n`,fdaItemIndex.length);

    let fdaInitString    = `products-grid row span9`,
        imgStartString   = `<img src="`,
        imgEndString     = `" alt="`,
        linkStartString  = `<h2 class="product-name"><a href="`,
        linkEndString    = `" title="`,
        descStartString  = `" title="`,
        descEndString    = `">`,
        priceStartString = `<span class="price">`,
        priceEndString   = `</span>`;

    let pointer = data.indexOf(fdaInitString);

    for (let i = 0; i < fdaItemIndex.length; i++){
      let FDAObj = {};
      
      pointer       = data.indexOf(imgStartString, pointer)+imgStartString.length;
      FDAObj.image  = data.slice(pointer,data.indexOf(imgEndString,pointer));
      pointer       = data.indexOf(linkStartString, pointer) + linkStartString.length;
      FDAObj.link   = data.slice(pointer,data.indexOf(linkEndString,pointer));
      pointer       = data.indexOf(descStartString, pointer) + descStartString.length;
      FDAObj.title  = data.slice(pointer,data.indexOf(descEndString,pointer));
      pointer       = data.indexOf(priceStartString, pointer) + priceStartString.length + 1;
      FDAObj.price  = data.slice(pointer,data.indexOf(priceEndString,pointer));
      FDAObj.pharma = `Farmacia del Ahorro`;

      FDAArray.push(FDAObj)
    }
  }
  return FDAArray;
}

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
