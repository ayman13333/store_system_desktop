const mongoose=require('mongoose');
// تواريخ الصلاحية الخاصة بالاصناف

const categoryItemsSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    key:{
        type:String
    }
},{
    timestamps:true
});

module.exports=mongoose.model('CategoryItem',categoryItemsSchema);