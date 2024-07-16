const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const user = require('../models/user');
const route = express.Router();
const {storeReturnTo} = require('../middleWares.js');
const nodemailer = require('nodemailer');
const sendMail = require('../sendMail.js');



route.get('/register', (req, res) => {
    res.render('users/register');
});

route.post('/register', storeReturnTo, async(req, res) => {
    try{
        const {username, password, email} = req.body;
        const newUser = await new user({email, username});
        const registerUser = await user.register(newUser, password);
        req.login(registerUser, (e) => {
            if(e){
                next(e);
            }
            returnUrl = res.locals.returnTo || '/destinations'
            req.flash('success', 'Registered Successfully');
            sendMail(registerUser._id);
            res.redirect(returnUrl);
        })
    } catch(e){
        if (e.code === 11000) {
            req.flash('error', e.message = 'The email was already registered!')
            res.redirect('register');
        } else{
            req.flash('error', e.message);
            res.redirect('register');
        }
        
    } 
})

route.get('/login',(req, res) => {
    res.render('users/login');
})

route.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', "Welcome Back");
    const returnUrl = res.locals.returnTo || '/destinations';
    res.redirect(returnUrl);
})

route.get('/logout', (req, res) => {
    req.logout(function (e){
        if(e){
            req.flash('error', e.message);
            return res.redirect('/destinations');
        }
        req.flash('success', 'Bye');
        res.redirect('back');
    })
})

module.exports = route;
