const express   = require('express'),
      kitSites  = express.Router();
      check     = require(`../helpers/checker`),
      multer    = require(`../helpers/multer`),
      User      = require(`../models/User`),
      Product   = require(`../models/Product`);
      Pharmacy  = require(`../models/Pharmacy`);
      Kit       = require(`../models/Kit`);
      Inventory = require(`../models/Inventory`);

//Find User's Kits
kitSites.get(`/user/:id/kit/`, check.isLogged, check.isUser, (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			Kit.find({userId: user._id})
				.populate('userId')
				.sort({created_at: 1})
				.then(kits => {
					let data = {
						title: 'Kit',
						css:   `profile`
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

//Delete Kit
kitSites.get(`/user/:id/kit/:name`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	Kit.deleteOne({$and: [{userId: req.body.userId}, {name: req.params.name}] })
		.then(kit => {
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Error al eliminar ${err}`)
		});
});

//Update Kit
kitSites.post(`/user/:id/kit/update/:name`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	Kit.findOneAndUpdate({$and: [{userId: req.body.userId}, {name: req.params.name}]}, {$set:{name:req.body.newName, kitKey: req.body.userId + req.body.newName}})
		.then(kit => {
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Error al renombrar ${err}`)
		});
});

//Add kit
kitSites.post(`/user/:id/kit/add`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	req.body.kitKey = req.params.id+req.body.name;
	
	Kit.create(req.body)
		.then(kit =>{
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Registering error ${err}`)
		});
});

kitSites.post(`/user/:userId/kit/:kitId/addproduct`, (req,res) => {
	Inventory.create(req.body)
	.then(inventory =>{
		res.json(inventory)
	})
	.catch(err => {
		console.log(`=====> Registering error ${err}`)
	});
});

//Add Products to kit
kitSites.post(`/user/:id/inventory/add`, check.isLogged, check.isUser, (req,res) => {
	let {userId, name, image, ingredient, pharmacy, price} = req.body
	Pharmacy. findOne({name: pharmacy})
					.then(pharma => {
						let pharmacy = pharma._id;
						Product	.create({name, image, ingredient, pharmacy, price})
										.then(product => {
											Kit	.findOne({userId})
													.then(kit => {
														Inventory	.create({kitId: kit._id, productId: product._id})
																			.then(() => res.redirect(`/user/${userId}/kit`))
																			.catch(err => {console.log('Product create =====>',err);});
													}).catch(err => {console.log('Kit find =====>',err);});
										}).catch(err => {console.log('Product create =====>',err);});
					}).catch(err => {console.log('Pharmacy find =====>',err);});
});

module.exports = kitSites;