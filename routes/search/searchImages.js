const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxFunc     = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{

  const {user} = req;

  let data = {
    title: `Search by Image - Results`,
    css:   `search`,
  }
  
  res.render('private/searchImages.hbs', {user, data});

});

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{
  
  const {user} = req;

  //hacer la peticion a Google
  
  auxFunc.getImageData(req.body.imageString)
    .then(imageData => {

      //console.log('Image Data from Google ======> ', imageData.data.responses)
      let imageRes = {
        description: imageData.data.responses[0].fullTextAnnotation.text,
        name:        imageData.data.responses[0].textAnnotations[1].description,
        ingredient : imageData.data.responses[0].textAnnotations[2].description
      }
      let data = {
          title: `${imageRes.name} - Results`,
          css:   `search`,
        },
        obj    = {};
            
      axios .all([auxFunc.getSanPablo(imageRes.name), auxFunc.getAhorro(imageRes.name)])
        .then(axios.spread((FSP, FA) => {

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
            await res.render('private/search', {data, user, imageRes, products})
          })(products);
        }));
    })
    .catch(err => {
      console.log('Error google request =====>', err)
    })
});

module.exports = searchSites;