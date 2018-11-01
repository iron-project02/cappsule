const express   = require(`express`),
      authSites = express.Router(),
      passport  = require(`passport`),
      check     = require(`../../helpers/checker`),
      mail      = require(`../../helpers/mailer`),
      User      = require(`../../models/User`),
      Kit       = require(`../../models/Kit`);

authSites.get(`/auth/register`, (req,res) => {
  let data = {
    title:    `Register`,
    css:      `auth`,
    register: true
  };
  res.render(`auth/auth`, {data});
});

authSites.post(`/auth/register`, (req,res) => {
  let data = {
    title:    `Register`,
    css:      `auth`,
    register: true
  };
  if (req.body.username === `` || req.body.password === ``) return res.render(`auth/auth`, {data, errorMessage: `Please indicate username and password`});
  if (req.body.password !== req.body[`confirm-password`]) return res.render(`auth/auth`, {data, errorMessage: `Passwords don't coincide`});
  const {username, email, name, password} = req.body;
  User.register({username, email, name}, password)
      .then(user => {
        Kit.create({userId: user._id})
            .then(() => {
              // const options = {
              //   email:   user.email,
              //   subject: `Confirma tu correo`,
              //   message: `Confirm to get cookies`
              // };
              // mail.send(options);
              res.redirect(`/auth/login`)
            });
      })
      .catch( err => {
        if (err.name === `UserExistsError`) return res.status(417).render(`auth/auth`, {data, errorMessage: `Phone number is already registered`});
        if (err.errmsg.includes(`E11000 duplicate key error index: cappsule.users.$email_1 dup key`)) return res.status(417).render(`auth/auth`, {data, errorMessage: `Email is already registered`});
      });
});

authSites.get(`/auth/login`, (req,res) => {
  let data = {
    title: `Login`,
    css:   `auth`,
    login: true
  };
  res.render(`auth/auth`, {data, errorMessage: req.flash(`error`)});
});

authSites.post(`/auth/login`, passport.authenticate(`local`, {
  successRedirect: `/`,
  failureRedirect: `/auth/login`,
  failureFlash:    `Incorrect Phone number or Password`
}));

authSites.get(`/auth/logout`, (req,res) => {
  req.logout();
  res.redirect(`/auth/login`);
});

authSites.get(`/admin`, (req,res) => {
  let data = {
    title: `Admin Log`,
    css:   `admin`
  }
  res.render(`auth/admin`, {data});
});

authSites.post(`/admin`, passport.authenticate(`local`, {
  successRedirect: `/admin/user`,
  failureRedirect: `/admin`
}));

authSites.get(`/admin/user`, check.isLogged, (req,res) => res.redirect(`/admin/${req.user._id}`));


module.exports = authSites;