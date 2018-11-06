const express     = require('express'),
      searchSites = express.Router(),
      check       = require(`../../helpers/checker`),
      axios       = require(`axios`),
      Product     = require(`../../models/Product`);


searchSites.get(`/search/image`, check.isLogged, (req, res) =>{
  
  res.render('private/searchImages.hbs');

})

searchSites.post(`/search/image`, check.isLogged, (req, res) =>{
  
  console.log('Front Data ======>', req.body.imageString.length)

  //res.json(req.body.imageString.length)

  //hacer la peticion a Google

  getImageData(req.body.imageString)
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