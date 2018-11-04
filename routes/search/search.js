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

          // San Pablo Drugstore search results identification

          let fspSearchIndex = 'col-xs-12 col-sm-6 col-md-4';
          let fspItemIndex = indexString(fspSearchIndex,FSP.data)
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
            
            pointer = FSP.data.indexOf(imgStartString, fspItemIndex[i])+imgStartString.length;
            FSPObj.image = FSP.data.slice(pointer,FSP.data.indexOf(imgEndString,pointer));
            pointer = FSP.data.indexOf(linkStartString, pointer) + linkEndString.length + 7;
            FSPObj.link = FSP.data.slice(pointer,FSP.data.indexOf(linkEndString,pointer));
            pointer = FSP.data.indexOf(titleStartString, pointer) + titleStartString.length + 33;
            FSPObj.title = FSP.data.slice(pointer,FSP.data.indexOf(titleEndString,pointer));
            pointer = FSP.data.indexOf(subtitleStartString, pointer) + subtitleStartString.length + 29;
            FSPObj.subtitle = FSP.data.slice(pointer,FSP.data.indexOf(subtitleEndString,pointer));
            pointer = FSP.data.indexOf(priceStartString, pointer) + priceStartString.length + 26;
            FSPObj.price = FSP.data.slice(pointer,FSP.data.indexOf(priceEndString,pointer));
            
            FSPArray.push(FSPObj)
          }

          obj.SanPablo = FSPArray;

          // Farmacia del Ahorro Drugstore search results identification

          let FDAArray = [];

          if (FA.data.indexOf('Resultados de la búsqueda')>0){

            let fdaSearchProducts = '<h2 class="product-name"><a href="';
            let fdaItemIndex = indexString(fdaSearchProducts,FA.data)
            console.log('Del Ahorro results =====> ',fdaItemIndex.length)
            let fdaInitString = 'products-grid row span9'

            imgStartString = '<img src="';
            imgEndString = '" alt="';
            linkStartString = '<h2 class="product-name"><a href="';
            linkEndString = '" title="';
            let descStartString = '" title="';
            let descEndString = '">';
            priceStartString = '<span class="price">'
            priceEndString = '</span>'

            pointer = FA.data.indexOf(fdaInitString)

            for (let i=0; i<fdaItemIndex.length; i++){

              let FDAObj = {};
              
              pointer = FA.data.indexOf(imgStartString, pointer)+imgStartString.length;
              FDAObj.image = FA.data.slice(pointer,FA.data.indexOf(imgEndString,pointer));
              pointer = FA.data.indexOf(linkStartString, pointer) + linkStartString.length;
              FDAObj.link = FA.data.slice(pointer,FA.data.indexOf(linkEndString,pointer));

              pointer = FA.data.indexOf(descStartString, pointer) + descStartString.length;
              FDAObj.description = FA.data.slice(pointer,FA.data.indexOf(descEndString,pointer));
              pointer = FA.data.indexOf(priceStartString, pointer) + priceStartString.length;
              FDAObj.price = FA.data.slice(pointer,FA.data.indexOf(priceEndString,pointer));

              FDAArray.push(FDAObj)
            }
          }

          obj.Ahorro = FDAArray;

          console.log(obj)

          res.json(obj);
        }));
})

module.exports = searchSites;