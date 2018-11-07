const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxFunc     = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{

  const {user} = req;
  
  res.render('private/searchImages.hbs', {user});

})

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{
  
  const {user} = req;

  auxFunc.getImageData(req.body.imageString)
    .then(imageData => {

      console.log('Image Data from Google ======> ', imageData.data.responses)
      let medicine = imageData.data.responses[0].textAnnotations[1].description;
      let medicine2 = imageData.data.responses[0].textAnnotations[2].description;
      //let medicine2 = imageData.data.responses[0].fullTextAnnotation.text;
      let variable = {
        description: imageData.data.responses[0].fullTextAnnotation.text
      }
      let data = {
        title: "Search by Image",
        css:   `search`,
        js:    `search`
      }
            
      //////

      axios .all([auxFunc.getSanPablo(medicine), auxFunc.getAhorro(medicine)])
        .then(axios.spread((FSP, FA) => {
          let obj  = {},
              html = require(`../../helpers/searchHTML`);

          // Data treatment
          obj.SanPablo = auxFunc.sanPabloResults(FSP.data);
          obj.Ahorro   = auxFunc.delAhorroResults(FA.data);

          obj.notfound = html.noResults();
          obj.html     = html.productCard();

          let products = obj.SanPablo.map(item => item);

          obj.Ahorro.forEach(item => products.push(item));

          (async function sortProducts(all) {
            all.sort((a,b) => {
              let priceA = parseFloat(a.price),
                  priceB = parseFloat(b.price);
              return priceA - priceB;
            });
            await console.log(allProducts);
          })(products);

          res.render('private/search', {data, user, variable, products, medicine, medicine2})

          //res.json(obj);
        }));



      //////
      
      
      //res.json(medicine);
    })
    .catch(err => {
      console.log('Error google request =====>', err)
    })
});

searchSites.get(`/search/images/prod`, check.isLogged, (req,res) => {
  
  axios .all([auxFunc.getSanPablo(req,res), auxFunc.getAhorro(req,res)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          
          //Data treatment

          obj.SanPablo = auxFunc.sanPabloResults(FSP.data);
          obj.Ahorro = auxFunc.delAhorroResults(FA.data);

          console.log(obj)

          res.json(obj);
        }));
})

module.exports = searchSites;