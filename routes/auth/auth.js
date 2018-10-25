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
  };
  res.render(`auth/auth`, {data});
});

authSites.post(`/auth/register`, (req,res) => {
  let data = {
    title:    `Register`,
    css:      `auth`,
    register: true
  };
  if (req.body.password !== req.body[`confirm-password`]) return res.render(`auth/auth`, {data, errorMessage: `Passwords don't coincide`});
  const {username, email, name, password} = req.body;
  User.register({username, email, name}, password)
      .then( user => {
        // const options = {
        //   email:   user.email,
        //   subject: `Confirma tu correo`,
        //   message: `Confirm to get cookies`
        // };
        // mail.send(options);
        res.redirect(`/auth/login`);
      })
      .catch( err => res.status(500).render(`auth/auth`, {err, errorMessage: `There was an error, please try again`}) );
});

authSites.get(`/auth/login`, (req,res) => {
  let data = {
    title: `Login`,
    css:   `auth`,
  };
  res.render(`auth/auth`, {data});
});

authSites.post(`/auth/login`, passport.authenticate(`local`, {
  successRedirect: `/`,
  failureRedirect: `/auth/login`
}));

authSites.get(`/auth/logout`, (req,res) => {
  req.logout();
  res.redirect(`/auth/login`);
});


module.exports = authSites;