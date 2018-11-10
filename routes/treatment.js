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
			treatments,
			prescriptions;

	p.push(Promise.resolve(Prescription.find({userId: user._id})
	  .populate({
			path: 'treatmentId',
			model: 'Treatment'
			//populate: {
			//	path: 'productId',
			//	model: 'Product'
			//}
		})
		.then(prescript => {
			prescriptions = prescript;
			console.log('prescriptions =====> ', prescriptions)
		})
		.catch(err => {
			console.log('ERROR =====> Error find populate', err)
		})));

	//Prescription.find({userId: user._id})
	//	.then(prescriptions => {
	//		console.log('Prescription ======> ', prescriptions)
	//		res.render(`private/treatment`, {user, prescriptions, data})
//
	//	})
	//	.catch(err => {
	//		console.log ('ERROR =====> Searching prescriptions', err)
	//	})
						
	//p.push(Promise.resolve(Treatment.find({userId: user._id})
	//	.populate({
	//		path: 'inventoryId',
	//		populate: {
	//			path: 'productId',
	//			model: 'Product'
	//		}
	//	})
	//	.then(treat => {
	//		treatments = treat;
	//		console.log('Treatments Find Populated  ===> ', treatments)
	//	})
	//	.catch(err => {
	//		console.log('ERROR =====>', err)
	//	})));

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
				console.log('Prescriptions Promise ===> ', prescriptions)
				//console.log('Treatments ObjectId Promise ===> ', treatments.objectId)
				res.render(`private/treatment`, {user, cabinet, prescriptions, data})
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
	console.log('Req.Body =====>',req.body)
	
	//data.slice(pointer,data.indexOf(imgEndString,pointer));
	
	//inventoryIdproductName

	req.body.inventoryId = req.body.inventoryIdproductName.slice(0,req.body.inventoryIdproductName.indexOf('='));
	req.body.productName = req.body.inventoryIdproductName.slice(req.body.inventoryIdproductName.indexOf('=')+1,req.body.inventoryIdproductName.length);
	
	req.body.userId = req.params.id;
	
	
	console.log('Req.Body Splited=====>',req.body)
	Treatment.create(req.body)
		.then(treatment => {
			console.log(`OK =====> Treatment created succesfully`)
			req.body.treatmentId = treatment._id;
			Prescription.findByIdAndUpdate(req.body.prescriptionId,{$push: {treatmentId:treatment._id}})
				.then(() => {

					///Crear los reminders

					req.body.userId = req.params.id;
					req.body.quantity = req.body.dosage;



					console.log('Req.body =====>', req.body)

					remNum = (req.body.days * 24 / req.body.frequency);

					//req.body.date = new Date();

					for (let i = 1; i<remNum; i++ ){
						req.body.date = new Date() + req.body.frequency * 3600000 * i;
						console.log('Date =====> ', req.body.date)
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