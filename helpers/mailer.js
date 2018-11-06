const mailer      = require(`nodemailer`),
      hbs         = require(`hbs`),
      fs          = require(`fs`),
      transporter = mailer.createTransport({
        service: `SendGrid`,
        auth: {
          user: process.env.SEND_USER,
          pass: process.env.SEND_PASS
        }
      });

transporter.verify(function(err, succ) {
  if (err) return console.log(err);
  console.log('SendGrid is ready to send mail');
});

const generateHTML = user => {
        const html = hbs.compile(fs.readFileSync((__dirname, `./views/mailing.hbs`), `utf8`));
        return html(user);
      },
      welcomeTXT = user => `\n
      Welcome, ${user.name}!\n\n

      You are now part of the great Cappsule community.\n
      Find out all the features we have to offer, by loggin in.\n
      https://cappsule-app.herokuapp.com\n\n

      Some of these are:\n
      • Find the cheapest option\n
      • Have control of all your medicines\n
      • Get reminders about your treatments\n\n

      We are really happy you to see you around!\n\n\n

      Cappsule team.`;

exports.send = user => {
  const mailOptions = {
    from:    `Cappsule Team \<noreply@cappsule.com\>`,
    to:      user.email,
    subject: `Welcome to Cappsule, ${user.name}! 💊`,
    text:    welcomeTXT(user),
    html:    generateHTML(user)
  };
  return transporter.sendMail(mailOptions);
};