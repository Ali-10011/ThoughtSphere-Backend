const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    blog_id: 
    {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
   
},
{
    timestamp: true
});


const notificationsModel = mongoose.model(
    "notifications",
    notificationSchema,
    "notifications"
  ); //now it will model the schema on the database
  
  module.exports = notificationsModel;