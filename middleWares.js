const destinations = require('./models/destinations');
const reviews = require('./models/review');
const {destinationSchema, reviewSchema} = require('./schemas')
const AppError = require('./utils/AppError');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const foundDest = await destinations.findById(id);
    if(foundDest.author.equals(req.user._id) || req.user.admin){
        next();
    } else {
        req.flash('error','You are not allowed to perform this action');
        return res.redirect(`/destinations/${id}`);
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const{id, reviewId} = req.params;
    const foundReview = await reviews.findById(reviewId);
    if(foundReview.author.equals(req.user._id) || req.user.admin){
        next();
    } else {
        req.flash('error','You are not allowed to perform this action');
        return res.redirect(`/destinations/${id}`);
    }
}

module.exports.ValidateDestSchema = (req, res, next) => {
    const {error} = destinationSchema.validate(req.body, {abortEarly: false});
    if(error){
        const msg = error.details.map(er => er.message).join('\n');
        throw new AppError(400, msg);
    } else {
        next();
    }
}

module.exports.ValidateReviewSchema = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body, {abortEarly: false});
    if(error){
        const msg = error.details.map(er => er.message).join(',');
        throw new AppError(400, msg);
    } else{
        next();
    }
}