const express   = require('express'),
      kitSites  = express.Router();
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`),
      Product   = require(`../../models/Product`);
      Kit       = require(`../../models/Kit`);
      Inventory = require(`../../models/Inventory`);

kitSites.get(`/user/:id/kit/`, check.isLogged, check.isUser, (req, res) => {

	User.findById(req.params.id)
		.then(user => {
			Kit.find({userId: user._id})
				.populate('userId')
				.then(kits => {
					let data = {
						title: 'Kit'
					}
					let p = [];
					let cabinet = {};
					for (let i = 0; i < kits.length; i++){
						p.push(Promise.resolve(Inventory.find({kitId: kits[i]._id})
						.populate('productId')
						.then(inventory => {
							cabinet[kits[i].name] = inventory;
						})
						.catch(err => {
							console.log('Error =====>', err)
						})));
					};
					Promise.all(p).then(() => {
						res.render(`private/kits`, {user, cabinet, data})
					});
				});
		});
});

kitSites.post(`/user/:id/kit/add`, (req,res) => {
	Product.create(req.body)
		.then(kit =>{
			console.log(`=====> Registrado correctamente`)
			res.json(kit)
		})
		.catch(err => {
			console.log(`=====> Error al registrar ${err}`)
			res.json(err)
		});
});

kitSites.post(`/user/:userId/kit/:kitId/addproduct`, (req,res) => {
	Inventory.create(req.body)
		.then(inventory =>{
			console.log(`=====> Registrado correctamente`)
			res.json(inventory)
		})
		.catch(err => {
			console.log(`=====> Error al registrar ${err}`)
			res.json(err)
		});
});



module.exports = kitSites;