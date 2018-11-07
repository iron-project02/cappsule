const express    = require(`express`)
      adminSites = express.Router(),
      check      = require(`../../helpers/checker`),
      User       = require(`../../models/User`),
      Offer      = require(`../../models/Offer`),
      Product    = require(`../../models/Product`),
      Pharmacy   = require(`../../models/Pharmacy`),
      Kit        = require(`../../models/Kit`);

adminSites.post(`/admin/:id/create`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.alias !== undefined) {
    Product.find({name: req.body.productId}).then(product => {
      Pharmacy.find({name: req.body.pharmacyId}).then(pharmacy => {
        req.body.productId  = product[0]._id;
        req.body.pharmacyId = pharmacy[0]._id;
        Offer.create(req.body).then(offer => res.json(offer)).catch(err => res.json(err))
      });
    });
  }
});

adminSites.get(`/admin/:id/search`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.alias !== undefined) {
    let query = new RegExp(`.*${req.query.alias}.*`);
    return Offer.find({alias: { $regex: query, $options: `i` }})
                .populate(`productId`)
                .populate(`pharmacyId`)
                .then(search => {
                  let html = require(`../../helpers/adminHTML`);
                  search.push(html.noResults());
                  search.push(html.offerEditForm());
                  res.json(search);
                });
  }
  if (req.query.email !== undefined) {
    let query = new RegExp(`.*${req.query.email}.*`);

    return User.find({email: { $regex: query, $options: `i` }}).sort({email: 1}).then(search => {
      let html = require(`../../helpers/adminHTML`);
      search.push(html.noResults());
      search.push(html.userEditForm());
      res.json(search);
    });
  }
});

adminSites.patch(`/admin/:id/update`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.username !== undefined) {
    return User.findByIdAndUpdate(req.body.userID, {$set: req.body}, {new: true}).then(user => res.json(user));
  }
});

adminSites.delete(`/admin/:id/delete/:user`, check.isLogged, check.isAdmin, (req,res) => {
  Kit.deleteOne({userId: req.params.user}).catch(err => console.log(err));
  return User.findByIdAndDelete(req.params.user).then(user => res.json(user));
});

module.exports = adminSites;