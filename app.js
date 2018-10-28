require('dotenv').config();

const bodyParser   = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express      = require('express'),
      favicon      = require('serve-favicon'),
      hbs          = require('hbs'),
      mongoose     = require('mongoose'),
      logger       = require('morgan'),
      path         = require('path'),
	  	passport     = require(`./helpers/passport`),
	  	flash        = require(`connect-flash`),
      session      = require(`express-session`);


mongoose.connect(process.env.Db, {useNewUrlParser: true})
        .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
        .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug    = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app .use(session({
			secret: process.env.SECRET,
			resave: true,
			saveUninitialized: true
		}))
		.use(passport.initialize())
		.use(passport.session())
		.use(flash());

// Middleware Setup
app.use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'))
   .set('view engine', 'hbs')
   .use(express.static(path.join(__dirname, 'public')))
   .use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

hbs.registerPartials(`${__dirname}/views/partials`);


// default value for title local
app.locals.appTitle = ' | Cappsule: Medicine cabinet on the go';


const index   	 = require('./routes/index'),
	  	authSites  = require(`./routes/auth/auth`),
	  	search     = require('./routes/search/search'),
	  	remiSites  = require('./routes/reminder/reminder'),
	  	userSites  = require(`./routes/user/profile`),
	  	treaSites  = require(`./routes/treatment/treatment`),
	  	prodSites  = require(`./routes/product/product`),
	  	adminSites = require(`./routes/user/admin`);

app .use('/', index)
		.use(`/`, authSites)
		.use('/', search)
		.use('/', remiSites)
		.use(`/`, userSites)
		.use(`/`, treaSites)
		.use(`/`, prodSites)
		.use(`/`, userSites)
		.use(`/`, adminSites);


module.exports = app;