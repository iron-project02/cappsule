const express   = require('express'),
      kitSites  = express.Router();
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`),
      Product   = require(`../../models/Product`);
      Kit       = require(`../../models/Kit`);
      Inventory = require(`../../models/Inventory`);

kitSites.get(`/user/:id/kit/`, (req, res) => {
//kitSites.get(`/user/:id/kit/`, check.isLogged, check.isUser, (req, res) => {

	User.findById(req.params.id)
	.then(user => {
		//res.json(user)
		Kit.find({userId: user._id})
			.then(kits => {
				//res.json(kits);
				let data = {
					title: 'Kit'
				}
				console.log('Kits ====>', kits)
				res.render(`private/kits`, {user, kits, data})
			});
	});
});


kitSites.post(`/user/:id/kit/add`, (req,res) => {
	Product.create(req.body)
		.then(product =>{
			console.log(`====> Registrado correctamente`)
			res.json(product)
		})
		.catch(err => {
			console.log(`====> Error al registrar ${err}`)
			res.json(err)
		});
});

module.exports = kitSites;