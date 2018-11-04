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

function indexString(string, searchData) {
  let index = 0
  let i = 0;
  let searchIndex = [];
  while(index>-1){
      index = searchData.indexOf(string,index);
      if (index >-1){
          searchIndex[i] = index;    
          i++;
          index ++;
      }
  }
  return searchIndex;
}

function sanPabloResults (data) {

  // San Pablo Drugstore search results identification
  let fspSearchIndex = 'col-xs-12 col-sm-6 col-md-4';
  let fspItemIndex = indexString(fspSearchIndex,data)
  console.log('San Pablo results =====> ',fspItemIndex.length)
  
  let imgStartString = '<img src="'
  let imgEndString = '" alt="'
  let linkStartString = '<a href="'
  let linkEndString = '">'
  let titleStartString = '<p class="item-title">'
  let titleEndString = '</p>'
  let subtitleStartString = '<p class="item-subtitle">'
  let subtitleEndString = '</p>'
  let priceStartString = '<p class="item-prize">'
  let priceEndString = '<span class="currency">'

  let FSPArray = [];
  let pointer = 0;
  
  for (let i=0; i<fspItemIndex.length; i++){

    let FSPObj = {};
    
    pointer = data.indexOf(imgStartString, fspItemIndex[i])+imgStartString.length;
    FSPObj.image = data.slice(pointer,data.indexOf(imgEndString,pointer));
    pointer = data.indexOf(linkStartString, pointer) + linkEndString.length + 7;
    FSPObj.link = data.slice(pointer,data.indexOf(linkEndString,pointer));
    pointer = data.indexOf(titleStartString, pointer) + titleStartString.length + 33;
    FSPObj.title = data.slice(pointer,data.indexOf(titleEndString,pointer));
    pointer = data.indexOf(subtitleStartString, pointer) + subtitleStartString.length + 29;
    FSPObj.subtitle = data.slice(pointer,data.indexOf(subtitleEndString,pointer));
    pointer = data.indexOf(priceStartString, pointer) + priceStartString.length + 26;
    FSPObj.price = data.slice(pointer,data.indexOf(priceEndString,pointer));
    
    FSPArray.push(FSPObj)
  }
  return FSPArray;
}

function delAhorroResults (data) {

  // Farmacia del Ahorro Drugstore search results identification

  let FDAArray = [];

  if (data.indexOf('Resultados de la búsqueda')>0){

    let fdaSearchProducts = '<h2 class="product-name"><a href="';
    let fdaItemIndex = indexString(fdaSearchProducts,data)
    console.log('Del Ahorro results =====> ',fdaItemIndex.length)
    let fdaInitString = 'products-grid row span9'

    let imgStartString = '<img src="';
    let imgEndString = '" alt="';
    let linkStartString = '<h2 class="product-name"><a href="';
    let linkEndString = '" title="';
    let descStartString = '" title="';
    let descEndString = '">';
    let priceStartString = '<span class="price">'
    let priceEndString = '</span>'

    let pointer = data.indexOf(fdaInitString)

    for (let i=0; i<fdaItemIndex.length; i++){

      let FDAObj = {};
      
      pointer = data.indexOf(imgStartString, pointer)+imgStartString.length;
      FDAObj.image = data.slice(pointer,data.indexOf(imgEndString,pointer));
      pointer = data.indexOf(linkStartString, pointer) + linkStartString.length;
      FDAObj.link = data.slice(pointer,data.indexOf(linkEndString,pointer));
      pointer = data.indexOf(descStartString, pointer) + descStartString.length;
      FDAObj.description = data.slice(pointer,data.indexOf(descEndString,pointer));
      pointer = data.indexOf(priceStartString, pointer) + priceStartString.length;
      FDAObj.price = data.slice(pointer,data.indexOf(priceEndString,pointer));

      FDAArray.push(FDAObj)
    }
  }
  return FDAArray;
}


function getSanPablo(req,res) {
  return axios.get(`https://farmaciasanpablo.com.mx/search/?text=${req.query.name}`);
}

function getAhorro(req,res) {
  let query = new RegExp(`.*${req.query.name}.*`);
  return axios.get(`http://www.fahorro.com/catalogsearch/result/?dir=asc&limit=56&order=price&q=${req.query.name}`);
}
searchSites.get(`/prod`, check.isLogged, (req,res) => {
  
  axios .all([getSanPablo(req,res), getAhorro(req,res)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          
          //Data treatment

          obj.SanPablo = sanPabloResults(FSP.data);
          obj.Ahorro = delAhorroResults(FA.data);

          console.log(obj)

          res.json(obj);
        }));
})

module.exports = searchSites;