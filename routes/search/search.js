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
  return axios.get(`http://www.fahorro.com/catalogsearch/result/?q=${req.query.name}`);
}
searchSites.get(`/prod`, check.isLogged, (req,res) => {
  
  axios .all([getSanPablo(req,res), getAhorro(req,res)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          
          ///Tratamiento de informacion

          // Identificar resultados de la busqueda

          let fspSearchIndex = 'col-xs-12 col-sm-6 col-md-4';
          let fspItemIndex = indexString(fspSearchIndex,FSP.data)
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
          let FSPObj = {};
          let pointer = 0;

          for (let i=0; i<fspItemIndex.length; i++){

            pointer = FSP.data.indexOf(imgStartString, fspItemIndex[i])+imgStartString.length;
            FSPObj.img = FSP.data.slice(pointer,FSP.data.indexOf(imgEndString,pointer));
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
          //obj.Ahorro   = FA.data;

          console.log('Obj =====> ', obj)
          res.json(obj);
        }));
})

module.exports = searchSites;