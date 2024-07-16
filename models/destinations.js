const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}};

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const destSchema = new Schema({
    title: String,
    price: Number,
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image:[imageSchema],
    description: String,
    location: String,
    review: [{
        type: Schema.Types.ObjectId, 
        ref:'Review'
    }]
}, opts);

destSchema.virtual('properties.Markup').get(function(){
    return `<a href="/destinations/${this._id}">${this.title}</a>`;
})

destSchema.post('findOneAndDelete', async function(dest){
    if(dest){
        await Review.deleteMany({
            _id: {
                $in: dest.review
            }
        })
    }
})

module.exports = mongoose.model('Campground', destSchema);