const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      auxFunc     = require(`../../helpers/auxFunctions`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{
  
  res.render('private/searchImages.hbs');

})

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{
  
  console.log('Front Data ======>', req.body.imageString.length)

  //res.json(req.body.imageString.length)

  //hacer la peticion a Google

  auxFunc.getImageData(req.body.imageString)
    .then(imageData => {
      console.log('Image Data from Google ======> ', imageData.data.responses)
      let medicine = imageData.data.responses;
      //res.redirect('/');
      //res.render('private/search', {medicine})
      res.json(medicine);
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