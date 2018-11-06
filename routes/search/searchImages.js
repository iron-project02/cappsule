const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxiliar    = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{
  
  res.render('private/searchImages.hbs');

});

searchSites.post(`/image`, check.isLogged, (req, res) =>{
  
  res.render('private/searchImages.hbs');
  console.log(req.body.imageString)
  
});

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{
  //res.render('private/search.hbs');
  //console.log('Front Data ======>', req.body.imageString.length)

  //hacer la peticion a Google
  
  auxiliar.getImageData(req.body.imageString)
    .then(imageData => {


      // Aqui hacer la peticion a la busqueda de las farmacias y luego enviar
      // la informacion a la vista de los resultados de la busqueda

      console.log('Image Data from Google ======> ', imageData.data.responses)
      let medicine = imageData.data.responses[0].textAnnotations[0].description;
      let medicine2 = imageData.data.responses[0].fullTextAnnotation.text;
      console.log('Text =====> ', medicine )
      console.log('Text =====> ', medicine2 )
      //res.redirect('/');
      let variable = {
        name: 'Hola Mundo'
      }
      res.render('private/search', {variable, medicine, medicine2})
      //res.json(medicine);
    })
    .catch(err => {
      console.log('Error google request =====>', err)
    })
    
});



searchSites.get(`/search/image/prod`, check.isLogged, (req,res) => {
  
  axios .all([auxiliar.getSanPablo(req.query.name), auxiliar.getAhorro(req.query.name)])
        .then(axios.spread((FSP, FA) => {
          let obj = {};
          
          //Data treatment

          obj.SanPablo = auxiliar.sanPabloResults(FSP.data);
          obj.Ahorro = auxiliar.delAhorroResults(FA.data);

          console.log(obj)

          res.json(obj);
        }));
})

module.exports = searchSites;