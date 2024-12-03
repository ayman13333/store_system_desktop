const mongoose = require('mongoose');

const InvoiceSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    serialNumber:{
        type:String,
        required:true
    },
    invoiceCode:{
        type:String,
        required:true
    },
    // اسم المورد
    supplierID:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // اسم الموظف
    employeeID:{
        type:mongoose.Schema.Types.ObjectId,
       ref:'User'
   },
    // تاريخ التسجيل
    registerDate:{
        type:String,
        required:true
    },
    // تاريخ التوريد
    supplyDate:{
        type:String,
        required:true
    },
    // بيانات الصرف
    invoicesData:{
        type:Array,
        required:true
    },
    // بيانات التوريد
    invoicesData2:{
        type:Array,
        required:true
    },
    // ملاحظات
    notes:{
        type:String,
        required:false
    },
    quantity:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

module.exports=mongoose.model('Invoice',InvoiceSchema);