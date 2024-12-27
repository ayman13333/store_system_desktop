const mongoose = require('mongoose');

const notificationsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
     categoryID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:false
        }
},
{
    timestamps:true
});

module.exports = mongoose.model('Notification', notificationsSchema);