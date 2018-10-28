const express   = require(`express`),
      userSites = express.Router(),
      check     = require(`../../helpers/checker`),
      multer    = require(`../../helpers/multer`),
      User      = require(`../../models/User`),
      language  = require(`../../helpers/language`);

userSites.get(`/user/:id`, check.isLogged, check.isUser, (req,res) => {
  User.findById(req.params.id)
      .then(user => {
        let data = {
          title: user.name,
          css:   `profile`,
          language
        };
        res.render(`private/profile`, {data, user});
      });
});

userSites.get(`/user/:id/edit`, check.isLogged, check.isUser, (req,res) => {
  const {user} = req;
  let   data   = {
          title: user.name,
          css:   `user-edit`
        };
  res.render(`private/userEdit`, {data, user})
});

userSites.post(`/user/:id/edit`, check.isLogged, check.isUser, multer.single(`profile_pic`), (req,res) => {
  const {user} = req;
  if (req.file !== undefined) req.body.profile_pic = req.file.url;
  User.findByIdAndUpdate(req.params.id, {$set: req.body})
      .then( () => res.redirect(`/user/${user._id}`) );
});

userSites.get(`/user/:id/delete`, check.isLogged, check.isUser, (req,res) => {
  User.findByIdAndDelete(req.user._id)
      .then( () => res.redirect(`/`) );
});

userSites.get(`/admin/:id`, check.isLogged, check.isAdmin, (req,res) => {
  const {user} = req;
  let data = {
    title: `Admin - ${req.user.name}`,
    css:   `admin`,
    js:    `admin`
  };
  res.render(`private/admin`, {data, user});
});


module.exports = userSites;