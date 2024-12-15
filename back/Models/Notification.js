const mongoose = require('mongoose');

const notificationsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Notification', notificationsSchema);