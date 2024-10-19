const mongoose = require('mongoose');

const usersSchema=new mongoose.Schema({
   
    type:{
        //  موظف (worker) - امين مخزن (storekeeper) - (supplier) مورد - (consumer) جهة صرف
        type:String,
        enum:['worker','storekeeper','admin','supplier','consumer']
    },
    fullName:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    // نوع التوريد
    typeOfSupply:{
        type:String
    },
    advantages:{
        type:String
    },
    disAdvantages:{
        type:String
    },
    email:{
        type:String,
        //unique:true
    },
    password:{
        type:String
    }
},
{
    timestamps:true
});

module.exports=mongoose.model('User',usersSchema);