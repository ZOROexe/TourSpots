if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const override = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const user = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const fUrl = 'mongodb://127.0.0.1:27017/Camp'
const dbUrl = process.env.DB_URL;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(override('_method'));
app.use(express.urlencoded({extended: true}));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbesecret'
    }
});

const sessionConfig = {
    store,
    secret: 'thisshouldbesecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.listen(3000, () => {
    console.log('Listening');
})

//'mongodb://127.0.0.1:27017/Camp'


mongoose.connect(dbUrl)
.then(() => {
    console.log('db CONNECTED!!');
})
.catch(err => {
    console.log('ERROR');
    console.log(err);
})

app.use(session(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname,'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtyyrxdmx/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


const destinationRoute = require('./routes/destinations');
const reviewRoute = require('./routes/review');
const userRoute = require('./routes/user');

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', userRoute);
app.use('/destinations', destinationRoute);
app.use('/destinations/:id/reviews', reviewRoute);

app.get('/', (req, res) => {
    res.render('home')
})


app.use((err, req, res, next) => {
    const{code = 500, message} = err;
    if(!err.message) err.message = 'Something Went Wrong';
    req.flash('error', err.message);
    /* res.render('error',{err}); */
    res.redirect(req.originalUrl);
})