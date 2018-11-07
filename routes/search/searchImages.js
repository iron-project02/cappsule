const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxFunc     = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{

  const {user} = req;
  
  res.render('private/searchImages.hbs', {user});

});

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{

  const {user} = req;

  //res.render('private/search.hbs');
  //console.log('Front Data ======>', req.body.imageString.length)

  //hacer la peticion a Google
  
  auxFunc.getImageData(req.body.imageString)
    .then(imageData => {


      // Aqui hacer la peticion a la busqueda de las farmacias y luego enviar
      // la informacion a la vista de los resultados de la busqueda

      console.log('Image Data from Google ======> ', imageData.data.responses)
      let medicine = imageData.data.responses[0].textAnnotations[1].description;
      let medicine2 = imageData.data.responses[0].textAnnotations[2].description;
      //let medicine2 = imageData.data.responses[0].fullTextAnnotation.text;
      console.log('Text =====> ', medicine)
      console.log('Text =====> ', medicine2)
      ////res.redirect('/');
      let variable = {
        description: imageData.data.responses[0].fullTextAnnotation.text
      }
      let data = {
        title: "Search by Image"
      }
      res.render('private/search', {user, variable, medicine, medicine2, data})
      //res.json(medicine);
    })
    .catch(err => {
      console.log('Error google request =====>', err);
      res.render('private/searchImages.hbs', {user});
    });    
});

searchSites.get(`/search/image/prod`, check.isLogged, (req,res) => {
  
  axios .all([auxFunc.getSanPablo(req.query.name), auxFunc.getAhorro(req.query.name)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          
          // Data treatment
          obj.SanPablo = auxFunc.sanPabloResults(FSP.data);
          obj.Ahorro   = auxFunc.delAhorroResults(FA.data);
 
          obj.notfound = html.noResults();
          obj.html     = html.productCard();
 
          res.json(obj);
        }));
});

searchSites.post(`/image`, check.isLogged, (req, res) =>{
  
  res.render('private/searchImages.hbs');
  console.log(req.body.imageString)
  
});

module.exports = searchSites;