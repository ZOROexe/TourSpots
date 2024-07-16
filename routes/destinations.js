const express = require('express');
const route = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const Destination = require('../models/destinations.js');
const {isLoggedIn, isAuthor, ValidateDestSchema} = require('../middleWares.js');
const multer = require('multer');
const {storage, cloudinary} = require('../cloudinary/index.js');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;



const upload = multer({storage});



route.get('/', WrapAsync(async(req, res, next) => {
    const destinations = await Destination.find({});
    res.render('index', {destinations});
}))

route.get('/:id/edit', isLoggedIn, isAuthor,  WrapAsync(async(req, res, next) => {
    const foundDest = await Destination.findById(req.params.id);
    if(!foundDest){
        req.flash('error', 'No Destination Found!');
        return  res.redirect('/destinations');
    }
    res.render('edit', {foundDest});
}))

route.put('/:id', isLoggedIn, isAuthor, upload.array('image'), ValidateDestSchema, WrapAsync(async(req, res, next) => {
    const {id} = req.params;
    const edited = await Destination.findByIdAndUpdate(id, {...req.body.destination});
    const geoData = await maptilerClient.geocoding.forward(req.body.destination.location, {limit: 1});
    if(geoData.length){
        edited.geometry = geoData.forward[0].geometry;
    }
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    edited.image.push(...imgs);
    let t = 1;
    if(req.body.deleteImages){
        if(edited.image.length > 1 && req.body.deleteImages.length < edited.image.length){
            for(let filename of req.body.deleteImages){
                await cloudinary.uploader.destroy(filename);
            }
            await edited.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}});
            req.flash('success', 'Image deleted succesfully');
        } else {
            t = 0;
        }
    }
    await edited.save();
    if(t === 1){
        req.flash('success', 'Destination updated!');
    } else {
        req.flash('error', 'Atleast one image is required!');
    }
    res.redirect(`/destinations/${edited._id}`);
}))

route.get('/new', isLoggedIn, (req,res) => {
    res.render('new');
})

route.post('/', isLoggedIn, upload.array('image'), ValidateDestSchema, WrapAsync(async(req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.destination.location,{limit: 1});
    const destination = new Destination(req.body.destination);
    destination.geometry = geoData.features[0].geometry;
    destination.image = req.files.map(f => ({url: f.path, filename: f.filename}));
    destination.author = req.user._id;
    await destination.save();

    req.flash('success', 'Destination Succesfully Created!');
    res.redirect(`/destinations/${destination._id}`);
}))

route.get('/:id', WrapAsync(async(req,res, next) => {
    const {id} = req.params;
    const foundDest = await Destination.findById(id).populate({path:'review', populate:{path: 'author'}}).populate('author');
     if(!foundDest){
        req.flash('error', 'No Destination Found!');
        return  res.redirect('/destinations');
    }
    res.render('details',{foundDest});
}))

route.delete('/:id/delete',  isLoggedIn, isAuthor, WrapAsync(async (req, res, next) => {
    await Destination.findByIdAndDelete(req.params.id);
    req.flash('success', 'Destination Succesfully Deleted!');
    res.redirect('/destinations');
}))

module.exports = route;