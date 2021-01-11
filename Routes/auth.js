const express = require('express');
const { check, body } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signup',authController.getSignup);

router.post('/signup',[
    check('email')
        .isEmail()
        .withMessage('Please Enter a valid email.').
        custom((value,{ req })=>{
            // if( value === 'test@test.com'){
            //     throw new Error('This email is forbidden.');
            // }
            // return true;
            return User.findOne({ email: value })
                .then(userDoc => {
                if (userDoc) {
                   return Promise.reject('Email Already exists please try another one.'); 
                }
            });
        }),
    body('password','please enter password with only number and text and atleast 5 characters')
        .isLength({ min: 5})
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((value, { req })=>{
            if( value !== req.body.password){
                throw new Error('Password have to match..');
            }
            return true;
    })
],
authController.postSignup);

router.post('/logout',authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);

module.exports = router;