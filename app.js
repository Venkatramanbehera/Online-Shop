const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = "mongodb+srv://dbUser:dbUser@cluster0.ikle8.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
    uri : MONGODB_URI,
    collection : 'sessions'
});

const csrfProtection = csrf();

app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const authRoutes = require('./Routes/auth');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store : store 
}))

app.use(csrfProtection);
app.use(flash())
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req,res,next)=>{
    // throw new Error('Sync Dummy');
    if( !req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user){
            return next();
        }
      req.user = user;
      next();
    })
    .catch(err => {
         next(new Error(err));
    });
})



app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next)=>{
    res.status(500).render('500', 
    { 
        pageTitle: 'Error!' , 
        path:'/500',
        isAuthenticated : req.isLoggedIn
    });
})

mongoose
.connect( MONGODB_URI )
.then( result => {
    app.listen(4000);
}).catch( err => {
    console.log(err);
});