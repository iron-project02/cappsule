const express    = require(`express`)
      adminSites = express.Router(),
      check      = require(`../../helpers/checker`),
      User       = require(`../../models/User`),
      Offer      = require(`../../models/Offer`),
      Product    = require(`../../models/Product`),
      Pharmacy   = require(`../../models/Pharmacy`),
      Kit        = require(`../../models/Kit`);

adminSites.get(`/admin/:id`, check.isLogged, check.isAdmin, (req,res) => {
  let data = {
        title: `Admin - ${req.user.name}`,
        css:   `admin`,
        js:    `admin`
      },
      {user} = req;
  Product.find().then(products => {
    Pharmacy.find().then(pharmacies => res.render(`private/admin`, {data, user, products, pharmacies}));
  });
});

adminSites.post(`/admin/:id/create`, check.isLogged, check.isAdmin, (req,res) => {
  if (req.query.alias !== undefined) {
    Offer.create(req.body).then(offer => res.json(offer)).catch(err => res.json(err));
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
  if (req.query.product !== undefined) {
    let query = new RegExp(`.*${req.query.product}.*`);
    return Product.find({name: { $regex: query, $options: `i` }}).sort({name: 1}).then(search => {
      let html = require(`../../helpers/adminHTML`);
      search.push(html.noResults());
      search.push(html.productEditForm());
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