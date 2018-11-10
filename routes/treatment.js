const express      = require('express'),
      treaSites    = express.Router();
      check        = require(`../helpers/checker`),
      multer       = require(`../helpers/prescription`),
      User         = require(`../models/User`),
      Treatment    = require(`../models/Treatment`);
      Prescription = require(`../models/Prescription`);
      Reminder     = require(`../models/Reminder`);

treaSites.get(`/user/:id/treatments`, check.isLogged, check.isUser, (req, res) => {

	const {user} = req;

	let cabinet   = {},
			data      = {
					title: 'Treatments'
				},
			p         = [],
			prescriptions;

	p.push(Promise.resolve(Prescription.find({userId: user._id})
	  .populate({
			path: 'treatmentId',
			model: 'Treatment'
		})
		.then(prescript => {
			prescriptions = prescript;
		})
		.catch(err => {
			console.log('ERROR =====> Error find populate', err)
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
				res.render(`private/treatment`, {user, cabinet, prescriptions, data})
			});
		})));
		
});

treaSites.post(`/user/:id/prescriptions/add`, check.isLogged, check.isUser, multer.array('prescription_pic'), (req, res) => {
	req.body.userId = req.params.id;
	if (req.files !== undefined){
		req.body.prescription_pic = req.files.map(picture => {
			return picture.url;
		});

	Prescription.create(req.body)
		.then(() => {
			res.redirect(`/user/${req.body.userId}/treatments`);
		})
		.catch(err => {
			console.log ('ERROR =====> Error creating the prescription', err)
		})
}})

treaSites.post(`/user/:id/treatments/add`, check.isLogged, check.isUser, (req, res) => {

	req.body.inventoryId = req.body.inventoryIdproductName.slice(0,req.body.inventoryIdproductName.indexOf('='));
	req.body.productName = req.body.inventoryIdproductName.slice(req.body.inventoryIdproductName.indexOf('=')+1,req.body.inventoryIdproductName.length);
	req.body.userId = req.params.id;
	
	Treatment.create(req.body)
		.then(treatment => {
			req.body.treatmentId = treatment._id;
			Prescription.findByIdAndUpdate(req.body.prescriptionId,{$push: {treatmentId:treatment._id}})
				.then(() => {
					req.body.userId = req.params.id;
					req.body.quantity = req.body.dosage;
					remNum = (req.body.days * 24 / req.body.frequency);
					let msDate = Date.parse(new Date());
					for (let i = 1; i<remNum; i++ ){
						req.body.date = new Date(msDate + req.body.frequency * 3600000 * i);
						Reminder.create(req.body)
					}
					res.redirect(`/user/${req.body.userId}/treatments`)
				})
				.catch(err => {
					console.log ('ERROR =====> Error updating prescription', err)
				});
		})
		.catch(err => {
			console.log ('ERROR =====> Error creating treatment', err)
		});
});


treaSites.get(`/user/:id/treatments/:treatmentId`, check.isLogged, check.isUser, (req, res) => {
	req.body.userId = req.params.id;
	Treatment.findByIdAndDelete(req.params.treatmentId)
		.then(() => {
			res.redirect(`/user/${req.body.userId}/treatments`)
		})
		.catch(err => {
			console.log ('=====> Error deleting the treatment', err)
		});
});

module.exports = treaSites;