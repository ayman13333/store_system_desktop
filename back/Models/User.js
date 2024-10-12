const mongoose = require('mongoose');

const usersSchema=new mongoose.Schema({
    fullName:{
        type:String
    },
    cardNumber:{
        type:String,
        // unique:true
    },
    type:{
        type:String,
        enum:['madany','darMember','army','admin','reception','accountant']
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    email:{
        type:String,
        //unique:true
    },
    password:{
        type:String
    }
});

module.exports=mongoose.model('User',usersSchema);