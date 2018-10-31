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
					console.log('Kits =====> ', kits);
					let p = []
					for (let i = 0; i < kits.length; i++){
						console.log('i =====>',i)
						console.log('Kit =====> ', kits[i]);
						p.push(Promise.resolve(Inventory.find({kitId: kits[i]._id}).populate('productId')));
					}
					Promise.all(p).then(inventories => {
						//console.log('inventories =====>', inventories[0] )
						res.render(`private/kits`, {user, kits, inventories, data})
					});
				});
		});
});

kitSites.get(`/user/:id/kit/:kitId`, check.isLogged, check.isUser, (req, res) => {

	console.log('Params ====>', req.params)
	//User.findById(req.params.id)
	//	.then(user => {
			Inventory.find({kitId: req.params.kitId})
				.then(inventories => {
					let data = {
						title: 'Kit Content'
					}
					res.render(`private/inventory`, {inventories, data})
					//res.json(inventories)
				});

	//	})
	
});

kitSites.post(`/user/:id/kit/add`, (req,res) => {
	Product.create(req.body)
		.then(kit =>{
			console.log(`====> Registrado correctamente`)
			res.json(kit)
		})
		.catch(err => {
			console.log(`====> Error al registrar ${err}`)
			res.json(err)
		});
});

kitSites.post(`/user/:userId/kit/:kitId/addproduct`, (req,res) => {
	Inventory.create(req.body)
		.then(inventory =>{
			console.log(`====> Registrado correctamente`)
			res.json(inventory)
		})
		.catch(err => {
			console.log(`====> Error al registrar ${err}`)
			res.json(err)
		});
});



module.exports = kitSites;