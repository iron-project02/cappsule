const express      = require('express'),
      treaSites    = express.Router();
      check        = require(`../helpers/checker`),
      multer       = require(`../helpers/prescription`),
      User         = require(`../models/User`),
      Treatment    = require(`../models/Treatment`);
      Prescription = require(`../models/Prescription`);

treaSites.get(`/user/:id/treatments`, check.isLogged, check.isUser, (req, res) => {

	const {user} = req;
	console.log('User in treatments =====> ',user);

	let cabinet   = {},
			data      = {
					title: 'Treatments'
				},
			p         = [],
			treatments;
						
	p.push(Promise.resolve(Treatment.find({userId: user._id})
		.populate({
			path: 'inventoryId',
			populate: {
				path: 'productId',
				model: 'Product'
			}
		})
		.then(treat => {
			treatments = treat;
		})
		.catch(err => {
			console.log('ERROR =====>', err)
		})));

	p.push(Promise.resolve(Kit.find({userId: user._id})
		.populate('userId')
		.then(kits => {
			for (let i = 0; i < kits.length; i++){
				p.push(Promise.resolve(Inventory.find({kitId: kits[i]._id})
				.populate('productId')
				.then(inventory => {
					cabinet[kits[i].name] = inventory;
				})
				.catch(err => {
					console.log('ERROR =====>', err)
				})));
			};
			Promise.all(p).then(() => {
				res.render(`private/treatment`, {user, treatments, cabinet, data})
			});
		})));
});

treaSites.post(`/user/:id/prescriptions/add`, check.isLogged, check.isUser, multer.array('prescription_pic'), (req, res) => {
	//const {user} = req;
	req.body.userId = req.params.id;
	if (req.files !== undefined){
		req.body.prescription_pic = req.files.map(picture => {
			return picture.url;
		});

	Prescription.create(req.body)
		.then(() => {
			console.log(`OK =====> Prescription created succesfully`)
			res.redirect(`/user/${req.body.userId}/treatments`);
		})
		.catch(err => {
			console.log ('ERROR =====> Error creating the prescription', err)
		})
}})

treaSites.post(`/user/:id/treatments/add`, check.isLogged, check.isUser, (req, res) => {
	req.body.userId = req.params.id;
	Treatment.create(req.body)
		.then(() => {
			res.redirect(`/user/${req.body.userId}/treatments`)
		})
		.catch(err => {
			console.log ('ERROR =====> Error creating the treatment', err)
		});
});

module.exports = treaSites;