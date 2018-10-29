const express   = require('express'),
      remSites  = express.Router(),
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`),
      Reminder  = require(`../../models/Reminder`);
      //Push      = require(`../../node_modules/push.js/bin/push.min.js`);

remSites.get(`/user/:id/reminders`, check.isLogged, check.isUser, (req, res) => {

    //setTimeout(() => {
    //    window.alert("Hello! I am an alert box!");
    //    
    //}, 1000);


    User.findById(req.params.id)
			.then(user => {
				//res.json(user)
				Reminder.find({userId: user._id})
					.populate(`productId`)
					.then(reminders => {
						//res.json(reminders);
						let data = {
							title: 'Reminders'
						}
						//console.log('Reminders ====>',reminders)
						res.render(`private/reminder`, {user, reminders, data})
					});
			});
});

remSites.post(`/user/:id/reminders/add`, check.isLogged, check.isUser, (req, res) => {
	req.body.userId = req.params.id;
	Reminder.create(req.body)
		.then(() => {


				

			res.redirect(`/user/${req.body.userId}/reminders`)
			//console.log('Reminder ====>',reminder)
		})
		.catch(err => {
			console.log ('====> Error creating the reminder', err)
		});
});

module.exports = remSites;