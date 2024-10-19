const mongoose = require('mongoose');

// الاصناف
const categoriesSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: [true, 'code is required and unique']
    },
    name: {
        type: String,
        required: [true, 'name is unique']
    },
    criticalValue: {
        type: Number,
        required: [true, 'criticalValue is required']
    },
    // سعر الوحدة
    unitPrice: {
        type: Number,
        required: [true, 'unitPrice is required']
    },
    totalQuantity: {
        type: Number,
        required: [true, 'totalQuantity is required']
    },
    unit:{
        type:String,
        required:[true,'unit is required']
    },
    // تواريخ الصلاحية
    expirationDatesArr:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryItem' }
    ]
}, {
    timestamps: true
});

// Override the toJSON method to convert _id to a string
categoriesSchema.set('toJSON', {
    transform: function (doc, ret, options) {
      ret._id = ret._id.toString(); // Convert _id to string
      return ret;
    }
  });

module.exports = mongoose.model('Category', categoriesSchema);