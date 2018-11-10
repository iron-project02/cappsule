const express   = require('express'),
      remSites  = express.Router(),
      check     = require(`../helpers/checker`),
      multer    = require(`../helpers/multer`),
      User      = require(`../models/User`),
      Reminder  = require(`../models/Reminder`);

remSites.get(`/user/:id/reminders`, check.isLogged, check.isUser, (req, res) => {
    User.findById(req.params.id)
			.then(user => {
				let p = [];
				let cabinet = {};
				let reminders;
				let data = {
					title: 'Reminders'
				}
				p.push(Promise.resolve(Reminder.find({userId: user._id})
					.sort({date: 1})
					.populate({
						path: 'inventoryId',
						populate: {
							path: 'productId',
							model: 'Product'
						}
					})
					.then(rem => {
						reminders = rem;
					})
					.catch(err => {
						console.log('Error =====>', err)
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
								console.log('Error =====>', err)
							})));
						};
						Promise.all(p).then(() => {
							res.render(`private/reminder`, {user, reminders, cabinet, data})
						});
					})));
			});
});

remSites.post(`/user/:id/reminders/add`, check.isLogged, check.isUser, (req, res) => {
	req.body.userId = req.params.id;
	console.log('Reminder req.body =====> ', req.body)
	Reminder.create(req.body)
		.then(() => {
			res.redirect(`/user/${req.body.userId}/reminders`)
		})
		.catch(err => {
			console.log ('=====> Error creating the reminder', err)
		});
});

remSites.get(`/user/:id/reminders/:remainderId`, check.isLogged, check.isUser, (req, res) => {
	req.body.userId = req.params.id;
	Reminder.findByIdAndDelete(req.params.remainderId)
		.then(() => {
			res.redirect(`/user/${req.body.userId}/reminders`)
		})
		.catch(err => {
			console.log ('=====> Error deleting the reminder', err)
		});
});

module.exports = remSites;