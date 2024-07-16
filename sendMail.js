const user = require('./models/user');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const html = `<p>Welcome to <b>TourSpots!</b></p>
    <br>
    <p>We are thrilled to have you join our community of travel enthusiasts. At TourSpots, we are passionate about helping you
    discover the world's best tourist destinations and hidden gems. Whether you're planning your next adventure or looking
    to share your favorite spots, you've come to the right place.</p>
    <br>
    <p>Here's what you can do on TourSpots:</p>
    <br>
    <p><b>Explore Destinations:</b> Browse through a diverse range of tourist spots, each with detailed information and beautiful
    images. From serene beaches to bustling cities, there's something for everyone.</p>
    <br>
    <p><b>Share Your Experiences:</b> Have a favorite spot you'd like to share? Post your own destinations and help others discover
    new places.</p>
    <br>
    <p><b>Leave Reviews:</b>Share your experiences by leaving reviews for the places you've visited. Your insights help others plan their perfect
    trips.</p>
    <br>
    <p>Thank you for joining TourSpots. We can't wait to see where your adventures take you!</p>
    <br>
    <p>Safe travels,</p>
    <p>The TourSpots Team</p>`


module.exports = async(id) =>{
    try{
        const mailUser = await user.findById(id);
        const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tourspotsteam@gmail.com',
            pass: 'dzqx atue yfui gylp'
        }
        });

        const mailOptions = {
        from: 'tourspotsteam@gmail.com',
        to: mailUser.email,
        subject: 'Welcome to TourSpots! Start Exploring Amazing Destinations Today!',
        html: html
        };

        const info = await transporter.sendMail(mailOptions);
        
    } catch(error) {
        console.log('error sendin mail' + error);
        
    }    
}
    
            