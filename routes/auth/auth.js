const express   = require(`express`),
      authSites = express.Router(),
      passport  = require(`passport`),
      User      = require(`../../models/User`),
      mail      = require(`../../helpers/mailer`);

authSites.get(`/auth/register`, (req,res) => {
  let data = {
    title:    `Register`,
    css:      `auth`,
    register: true
  }
  res.render(`auth/auth`, {data});
});

authSites.get(`/auth/login`, (req,res) => {
  let data = {
    title: `Login`,
    css:   `auth`,
  }
  res.render(`auth/auth`, {data, errorMessage: `ok`});
});

authSites.get(`/auth/logout`, (req,res) => {
  req.logout();
  res.redirect(`/auth/login`);
});


module.exports = authSites;