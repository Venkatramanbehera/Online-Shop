const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const errorController = require('./controllers/error');


const User = require('./models/user');

const app = express();


app.set('view engine','ejs');
app.set('views','views');

const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use((req, res, next) => {
    User.findById('5ff1ecb1bfe09e1f046cc902')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect("mongodb+srv://dbUser:dbUser@cluster0.ikle8.mongodb.net/shop?retryWrites=true&w=majority")
.then( result => {
    User.findOne().then( user => {
        if( !user ){
        const user = new User({
            name: "chiku",
            email : "chiku@mail.com",
            cart : {
                items : []
            }
        });
        user.save();
        }
    });
    app.listen(4000);
}).catch( err => {
    console.log(err);
});