const mongoose=require('mongoose');
// تواريخ الصلاحية الخاصة بالاصناف

const categoryItemsSchema=new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

// Override the toJSON method to convert _id to a string
categoryItemsSchema.set('toJSON', {
    transform: function (doc, ret, options) {
      ret._id = ret._id.toString(); // Convert _id to string
      return ret;
    }
  });

module.exports=mongoose.model('CategoryItem',categoryItemsSchema);

// module.exports = mongoose.model('Category', categoriesSchema);