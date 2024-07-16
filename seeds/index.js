const mongoose = require('mongoose');
const Destinations = require('../models/destinations');
const cities = require('./cities');
const {descriptors, places} = require('./helper');
mongoose.connect('mongodb://127.0.0.1:27017/Camp')
.then(() => {
    console.log('db CONNECTED!!');
})
.catch(err => {
    console.log('ERROR');
    console.log(err);
})

const setTitle = array => array[Math.floor(Math.random() * array.length)];


const setDb = async() => {
    await Destinations.deleteMany({});
    for(let i = 1; i<300; i++){
        let rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 1;
        const city = new Destinations({
            author: '6690e9168edf1551b639467b',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${setTitle(descriptors)} ${setTitle(places)}`,
            image: {
                        url: 'https://res.cloudinary.com/dtyyrxdmx/image/upload/v1720943950/Camp/gw3aflmxurjdquw39do5.png',
                        filename: 'Camp/gw3aflmxurjdquw39do5',
                    },
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem amet totam architecto animi? Temporibus amet vero eveniet laborum at praesentium perspiciatis? Amet, dicta ex! Officiis assumenda quas tempora asperiores libero?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            }
        });
        await city.save();
    }
}

setDb().then(() => {
    mongoose.connection.close();
});
