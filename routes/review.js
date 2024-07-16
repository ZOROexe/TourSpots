const express = require('express');
const route = express.Router({mergeParams: true});
const WrapAsync = require('../utils/WrapAsync');
const AppError = require('../utils/AppError');
const Destination = require('../models/destinations.js');
const Reviews = require('../models/review');
const {isLoggedIn, isReviewAuthor, ValidateReviewSchema} = require('../middleWares.js');



route.post('/', isLoggedIn, ValidateReviewSchema,  WrapAsync(async(req, res, next) => {
    const{id} = req.params;
    const foundDest = await Destination.findById(id);
    const review = new Reviews(req.body.review);
    review.author = req.user._id;
    foundDest.review.push(review);
    await foundDest.save();
    await review.save();
    req.flash('success', 'Review Posted!');
    res.redirect(`/destinations/${foundDest._id}`);
}))

route.delete('/:reviewId', isReviewAuthor, isLoggedIn, WrapAsync(async(req, res, next) => {
    const{id, reviewId} = req.params;
    await Destination.findByIdAndUpdate(id, {$pull:{review: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/destinations/${id}`);
}))

module.exports = route;