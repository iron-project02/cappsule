const express   = require('express'),
      kitSites  = express.Router();
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`),
      Product   = require(`../../models/Product`);
      Kit       = require(`../../models/Kit`);
      Inventory = require(`../../models/Inventory`);

//Find User's Kits
kitSites.get(`/user/:id/kit/`, check.isLogged, check.isUser, (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			Kit.find({userId: user._id})
				.populate('userId')
				.sort({created_at: 1})
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

//Delete Kit
kitSites.get(`/user/:id/kit/:name`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	Kit.deleteOne({$and: [{userId: req.body.userId}, {name: req.params.name}] })
		.then(kit => {
			console.log(`=====> Eliminado correctamente`)
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Error al eliminar ${err}`)
			res.json(err)
		});
});

//Update Kit
kitSites.get(`/user/:id/kit/update/:name`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	Kit.findOneAndUpdate({$and: [{userId: req.body.userId}, {name: req.params.name}]}, {$set:{name:"Naomi"}})
		.then(kit => {
			console.log(`=====> Renombrado correctamente`)
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Error al eliminar ${err}`)
			res.json(err)
		});
});

//Add kit
kitSites.post(`/user/:id/kit/add`, check.isLogged, check.isUser, (req,res) => {
	req.body.userId = req.params.id;
	req.body.kitKey = req.body.name;
	
	//Realizar la busqueda para implementar el unique
	
	Kit.create(req.body)
		.then(kit =>{
			console.log(`=====> Registrado correctamente`)
			res.redirect(`/user/${req.body.userId}/kit`)
		})
		.catch(err => {
			console.log(`=====> Error al registrar ${err}`)
			res.json(err)
		});
});

//Add Products to kit
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