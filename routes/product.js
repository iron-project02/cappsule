const express   = require('express'),
      prodSites = express.Router();
      check     = require(`../helpers/checker`),
      multer    = require(`../helpers/multer`),
      User      = require(`../models/User`),
      Product   = require(`../models/Product`);

prodSites.post(`/products`, (req,res) => {
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

module.exports = prodSites;