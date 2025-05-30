const { app, BrowserWindow, ipcMain, Notification, screen } = require('electron');
// const url = require('url');
const path = require('path');
const connectDB = require('./back/db'); // Import the database connection
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./back/Models/User');
const Category = require('./back/Models/Category');
const CategoryItem = require('./back/Models/CategoryItem');
const Invoice = require('./back/Models/Invoice');
const NotificationModel=require('./back/Models/Notification');
// const { fiveDays } = require('./front/src/Constants');

const cron = require("node-cron");

const fiveDays = 15;



// let requestQueue = Promise.resolve();






async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });





  // test
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3000');

  // production
  // const startUrl = path.join(__dirname,'front','build','index.html');
  //  mainWindow.loadFile(startUrl);
}


// Schedule a cron job to run every minute
const setupCronJob = async() => {

  // //  every day 0 0 * * *
  // cron.schedule("* * * * *",async () => {
  //   console.log("Cron job executed: ", new Date().toLocaleString());

     

  //   await Promise.all(
  //     categories?.map(async(category)=>{
  //       let yellowCount = 0;

  //       category?.expirationDatesArr?.map(async (el)=>{
  //       const currentDate = new Date();
  //       const itemDate = new Date(el?.date);

  //       if (currentDate.getTime() > itemDate.getTime()) {
  //         yellowCount++;
  //       }

  //       }
  //     )
       
  //        let newNotification=new NotificationModel();
  //     if (yellowCount == category?.expirationDatesArr?.length){
  //        newNotification.title=' الصنف '+`${category?.name} `+'منتهي الصلاحية';
  //        await newNotification.save();
  //     } 
  //     else if(yellowCount>0){
  //       newNotification.title=' الصنف'+`${category?.name} `+'به كميات منتهية الصلاحية';
  //       await newNotification.save();
  //     }


  //     if(category.criticalValue >= category.totalQuantity){
  //       newNotification.title=' كمية الصنف '+`${category?.name} `+'اقل من الحد الحرج';
  //       await newNotification.save();
  //     }

  //     })
  //   );
  //  // console.log('categories',categories);
   
  // });


  await NotificationModel.deleteMany({});

  let categories=await Category.find().populate('expirationDatesArr');
  
  await Promise.all(
    categories?.map(async(category)=>{
      let yellowCount = 0;

      category?.expirationDatesArr?.map(async (el)=>{
      const currentDate = new Date();
      const itemDate = new Date(el?.date);

      if (currentDate.getTime() > itemDate.getTime()) {
        yellowCount++;
      }

      }
    )
     
       let newNotification=new NotificationModel();
    if (yellowCount == category?.expirationDatesArr?.length){
       newNotification.title=' الصنف '+`${category?.name} `+'منتهي الصلاحية';

       newNotification.categoryID=category?._id;
       await newNotification.save();
    } 
    else if(yellowCount>0){
      newNotification.title=' الصنف'+`${category?.name} `+'به كميات منتهية الصلاحية';

      newNotification.categoryID=category?._id;
      await newNotification.save();
    }


    if(category.criticalValue >= category.totalQuantity){
      newNotification.title=' كمية الصنف '+`${category?.name} `+'اقل من الحد الحرج';

      newNotification.categoryID=category?._id;
      await newNotification.save();
    }

    })
  );

  console.log("Cron job scheduled. old Notifications Deleted !");
};

app.whenReady().then(async () => {
  await connectDB();

 // const result = await User.deleteMany({ email: { $ne: 'admin@gmail.com' } });

  // const result = await User.deleteMany({
  //   $or: [
  //     { email: { $ne: 'admin' } }, // Email not equal to targetEmail
  //     { email: { $exists: false } }   // Email field does not exist
  //   ]
  // });

  await setupCronJob();

  createWindow();
 

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
// // login
ipcMain.handle('login', async (event, data) => {
  try {
    const user = await User.findOne({ email: data.email }).lean()
    if (!user) {
      new Notification({ title: 'خطأ في البريد الالكتروني او كلمة المرور' }).show();
      return {
        success: false
      }
    }

    // Compare the input password with the hashed password in the database
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (isMatch) {
      new Notification({ title: 'تم  الدخول بنجاح' }).show();
      return {
        success: true, user: { ...user, _id: user?._id.toString() }
      }

    } else {
      new Notification({ title: 'خطأ في البريد الالكتروني او كلمة المرور' }).show();
      return {
        success: false
      }

    }

  } catch (error) {
    // errno: -4077,
    new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();
    console.log('mmmmmmmmmmmmmmmm');
    // code: 'ECONNRESET'
    console.log(error.errno);
    console.log('mmmmmmmmmmmmmmmm');
  }
});

// // users
ipcMain.handle('add-user', async (event, userData) => {
  try {

    //console.log('ggggggggggggggggggggggggggg');
    let hashedPassword = '';

    // للموظف
    if (userData.email || userData.password) {
      const foundUser = await User.findOne({ email: userData.email });
      if (foundUser !== null) {
        new Notification({ title: 'هذا الاميل موجود بالفعل' }).show();
        return;
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }

    console.log('userData:', userData);

    // للمورد
    if (userData.type == 'supplier') {
      // اتأكد ان الرقم القومي مش موجود قبل كدة
      const foundUser = await User.findOne({ serialNumber: userData.serialNumber });
      if (foundUser !== null) {
        new Notification({ title: 'هذا الرقم القومي تم ادخاله من قبل' }).show();
        return;
      }
    }


    const newUser = new User(userData);
    await newUser.save();

    console.log('newUser saved:', newUser);

    new Notification({ title: 'تم اضافة المستخدم بنجاح' }).show();

    return {
      success: true, newUser: {
        ...newUser.toObject(),
        _id: newUser?._id.toString()
      }
    };
  } catch (error) {
    console.log('ooooooooooooooooooo');
    console.log(error);
    console.log('ooooooooooooooooooo');
    // new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

    new Notification({ title: 'فشل في اضافة المستخدم' }).show();
    return { success: false, error: error.message };
  }
});

ipcMain.handle('getAllUsers', async (event, data) => {
  try {

    let filter = {};

    // صفحة الموظفين
    if (data.type == 'worker') {
      filter = [
        { type: 'worker' },
        { type: 'storekeeper' },
        { type: 'admin' }
      ];
    }

    // // صفحة الموردين
    else if (data.type == 'allSuppliers') {
      filter = [
        { type: 'consumer' },
        { type: 'supplier' },
        { type: 'transfer' },
      ];
    }
    else {
      filter = [
        { type: data.type }
      ];
    }

    let users = await User.find({
      $or: filter
    })
      .select('+status')
      .lean();

    console.log('users', users);


    users = users.map(doc => {
      return {
        ...doc,
        _id: doc._id.toString()
      }
    });

    return { success: true, users };

  } catch (error) {
    new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

    return { success: false, error: error.message };
  }
});

// // edit تعديل موظف او ادمن او امين مخزن
ipcMain.handle('editUser', async (event, data) => {
  try {

    //lastEmail
    if (data?.email !== data?.lastEmail) {
      let foundEmail = await User.findOne({ email: data?.email });
      console.log("foundEmail", foundEmail);

      if (foundEmail !== null) {
        new Notification({ title: 'هذا الايميل موجود بالفعل' }).show();
        return;
      }

    }


    let hashedPassword = '';
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;
    }

    let updateObj = {
      email: data?.email
    };

    if (data.password) updateObj.password = data.password;
    if (data.type) updateObj.type = data.type;

    let user = await User.findByIdAndUpdate(data?._id, updateObj, {
      new: true
    });

    new Notification({ title: 'تم تعديل المستخدم بنجاح' }).show();

    console.log("user", user);

  } catch (error) {
    // new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

    new Notification({ title: 'فشل في عملية التعديل' }).show();
  }
});

// // edit مورد او جهة صرف
ipcMain.handle('editGuest', async (event, data) => {
  try {
    const id = data?._id;
    // data=data.delete('_id');
    delete data['_id'];

    // للمورد
    if (data.type == 'supplier') {
      // اتأكد ان الرقم القومي مش موجود قبل كدة
      const foundUser = await User.findOne({
        $and: [
          { serialNumber: data.serialNumber },
          { _id: { $ne: id } }, // Exclude users with status 'inactive'
        ],
      }
      );

      if (foundUser !== null) {
        new Notification({ title: 'هذا الرقم القومي تم ادخاله من قبل' }).show();
        return;
      }
    }

    let user = await User.findByIdAndUpdate(id, data, {
      new: true
    }).lean();



    // console.log("user",user);
    user = {
      ...user,
      _id: user?._id.toString()
    }
    new Notification({ title: 'تم التعديل بنجاح' }).show();

    return {
      success: true,
      user
    }

  } catch (error) {

    new Notification({ title: 'فشل في عملية التعديل' }).show();

  }
});

// الاصناف (categories)
ipcMain.handle('getAllCategories', async (event, data) => {
  try {
    // const { date } = data;
    let filter = {};
    // if(date){
      // filter.createdAt= {$lte : date};
    // }
    let categories = await Category.find(filter)
      .populate('expirationDatesArr user')
      // .sort({ createdAt: -1 })
      .lean();

    // convert objectid to string
    categories = categories?.map(el => {
      return {
        ...el,
        _id: el?._id?.toString(),
        user: {
          ...el?.user,
          _id: el?.user?._id.toString()
        },
        expirationDatesArr: el?.expirationDatesArr?.map(item => {
          // console.log('cccccccc');
          // console.log('item',item);
          // console.log('cccccccc');
          return {
            ...item,
            _id: item?._id?.toString()
          }
        })
      }
    });

    // Sort expirationDatesArr in descending order by createdAt
    categories = categories.map(category => {

      category.expirationDatesArr.sort((a, b) => new Date(a.date) - new Date(b.date)); // Descending
      return category;
    });

    console.log('categories-                ------------');

    return {
      success: true,
      categories
    }

  } catch (error) {
    console.log(error);
    new Notification({ title: 'حدث مشكلة اثناء الاتصال بالانترنت' }).show();

    return {
      success: false
    };
  }
});

// 1) add category
ipcMain.handle('addCategory', async (event, data) => {
  try {
    let { expirationDatesArr, code, name, criticalValue, unitPrice, unit, quantity } = data;

   // if (expirationDatesArr.length == 0) return new Notification({ title: 'قم ب ادخال الاصناف' }).show();

    // الاول شوف الكود ده دخل قبل كدة ولا لا
    const lastSerialNumber = await Category.findOne({}).sort({ createdAt: -1 });
    let serialNumber=0;
    if(lastSerialNumber?.serialNumber){
      serialNumber = lastSerialNumber.serialNumber += 1;
    }else{
      serialNumber = 1;
    }
    

    const foundCode = await Category.findOne({ code });
    if (foundCode !== null) {
      new Notification({ title: 'هذا الكود موجود بالفعل' }).show();
      return {
        success: false
      };
    }

    //2) ضيف الصنف
    let newCategoryObj = {
      code,
      name,
      criticalValue,
      unitPrice,
      unit,
      serialNumber,
      //  expirationDatesArr: expirationDatesArrIDS,
      totalQuantity: quantity
    }

    let newCategory = new Category(newCategoryObj);
    await newCategory.save();

    console.log('newCategory', newCategory);
    // 1) ضيف تواريخ الصلاحية في ال model
    let totalQuantity = 0;
    let expirationDatesArrIDS = [];

    if(expirationDatesArr.length > 0){
      await Promise.all(
        expirationDatesArr?.map(async (el) => {
          // console.log("el",el);
          totalQuantity += Number(el?.quantity);
          let newCategoryItem = new CategoryItem({
            ...el,
            categoryID: newCategory?._id
          });
          await newCategoryItem.save();
  
          newCategoryItem = newCategoryItem.toJSON();
  
  
          expirationDatesArrIDS.push(newCategoryItem?._id);
  
          console.log('CategoryItem saved:', newCategoryItem);
        })
      );
      newCategory.expirationDatesArr = expirationDatesArrIDS;
    }
  

   

    await newCategory.save();

    console.log(newCategory);


    // console.log('expirationDatesArrIDS', expirationDatesArrIDS);
    // console.log('totalQuantity', totalQuantity);

    //expirationDatesArrIDS= expirationDatesArrIDS.map(id => mongoose.Types.ObjectId(id));





    return {
      success: true
    };
  } catch (error) {

    console.log(error);
    new Notification({ title: 'فشل في عملية الاضافة' }).show();

    return {
      success: false
    };

  }
})

// edit category
ipcMain.handle('editCategory', async (event, data) => {
  try {
    let { expirationDatesArr, code, name, criticalValue, unitPrice, unit, quantity, lastCode, user, editDate, _id } = data;

   // if (expirationDatesArr.length == 0) return new Notification({ title: 'قم ب ادخال الاصناف' }).show();

    const oldCategory=await Category.findById(_id);

    if (code !== lastCode) {
      // الاول شوف الكود ده دخل قبل كدة ولا لا
      const foundCode = await Category.findOne({ code });
      if (foundCode !== null) {
        new Notification({ title: 'هذا الكود موجود بالفعل' }).show();
        return;
      }
    }

    console.log("EXPiration : ", expirationDatesArr)

    let totalQuantity = 0;

   // const oldExpirations=await CategoryItem.find

   const oldExpirations = await CategoryItem.deleteMany({
    categoryID:oldCategory?._id
   });

   let newCategoryObj ={};
   let expirationDatesArrIDS=[];
   
   if(expirationDatesArr.length > 0){
    await Promise.all(
      expirationDatesArr?.map(async (el) => {
        // console.log("el",el);
        totalQuantity += Number(el?.quantity);
        let newCategoryItem = new CategoryItem({
          ...el,
          categoryID: oldCategory?._id
        });
        await newCategoryItem.save();

        newCategoryItem = newCategoryItem.toJSON();


        expirationDatesArrIDS.push(newCategoryItem?._id);

        console.log('CategoryItem saved:', newCategoryItem);
      })
    );
    newCategoryObj.expirationDatesArr = expirationDatesArrIDS;
  }
    
   
    let expiration_dates = [];
    const categoryItemObject = await CategoryItem.find({ categoryID: _id, });
    let finalTotalQuantity =0;
    categoryItemObject.forEach((ele) => { finalTotalQuantity += ele.quantity;  expiration_dates.push(ele._id); });

    //2) ضيف الصنف
     newCategoryObj = {
      ...newCategoryObj,
      code,
      name,
      criticalValue,
      unitPrice,
      unit,
    //  expirationDatesArr: expiration_dates,
      totalQuantity: finalTotalQuantity,
      user,
      editDate
    }

      console.log('newCategoryObj',newCategoryObj);

    let newCategory = await Category.findByIdAndUpdate(
      oldCategory?._id,
      newCategoryObj,
      {
        new: true
      }
    );


    if (newCategory == null)
      return {
        success: false
      }
    else
      return {
        success: true
      };




  } catch (error) {
    console.log("error", error);
    new Notification({ title: 'فشل في عملية التعديل' }).show();
  }
});

// فاتورة توريد
ipcMain.handle('addSupplyInvoice', async (event, data) => {
  try {
    const {
      selectedOptionArr,
      supplierID,
      employeeID,
      registerDate,
      total_bill_price,
      supplyDate,
      notes,
      type,
      invoiceNumber
    } = data;

    const forSearch = new Date(supplyDate);
    let invoiceCode = 0;
    let lastInvoice = await Invoice.findOne({ type: "supply" }).sort({ createdAt: -1 });

    console.log("lastInvoice : " , lastInvoice);

    if(lastInvoice){
      // const number =  Number(lastInvoice.invoiceCode.split("أضافه (")[1].split(")")[0]) +1;

      const number =  Number(lastInvoice.invoiceCode.split("أضافه (")[1].split(")")[0]) +1;
      console.log('number',number);

     // return serialNumber;
      invoiceCode = `أضافه (${number})`;
    }else{
      invoiceCode = `أضافه (1)`;
    }


    console.log('bbbbbbbbbbbbbbbbb');
    let serial_nmber = invoiceNumber;


    await Promise.all(
      selectedOptionArr?.map(async (el) => {
        let newTotalQuantity = 0; // Initialize newTotalQuantity
        let totalQuantity = 0;   // Initialize totalQuantity
        let category = await Category.findById(el._id);
        // Process expiration dates and save CategoryItem
        await Promise.all(
          el.expirationDatesArr.map(async (ele) => {
            newTotalQuantity += ele.quantity;
            const date2 = new Date(ele.date);
            date2.setUTCHours(0, 0, 0, 0);
            let date = date2.setDate(date2.getDate() - fiveDays);
            const date3 = new Date(date); // Convert to Date object
            const dateString = date3.toString();
            console.log("DATE ======>  ", date.toString());
            /////////////////////////////////////////////////////////////////////////////////////

            const categoryItemObject = await CategoryItem.find({ categoryID: el._id });
            const dateE = new Date(ele.date);
            let timestamp = dateE.setDate(dateE.getDate() - fiveDays);
            const targetDate = new Date(timestamp);
            targetDate.setUTCHours(0, 0, 0, 0);
            const result = categoryItemObject.find(item => {
              console.log("Target : ", targetDate)
              const itemDate = new Date(item.date);
              itemDate.setUTCHours(0, 0, 0, 0);
              console.log("Item : ", itemDate)
              return itemDate.getFullYear() === targetDate.getFullYear() &&
                itemDate.getMonth() === targetDate.getMonth() && itemDate.getDate() === targetDate.getDate();
            });

            if (result) {
              console.log("EXIST  : ", "OLD : ", result.quantity, "NEW : ", ele.quantity);
              await CategoryItem.findByIdAndUpdate(result._id,
                { quantity: result.quantity + ele.quantity }, { new: true });
              return;
            } else {
              console.log("======== NOT EXIST ========");
              /////////////////////////////////////////////////////////////////////////////////////           
              let newCategoryItem = new CategoryItem({
                quantity: ele.quantity,
                date: dateString,
                categoryID: el._id,
              });
              await newCategoryItem.save();
            }
          })
        );

        if (type === "supply") {

          const categoryItemObject = await CategoryItem.find({
            categoryID: el._id,
          });

          let expiration_dates = [];
          // Calculate totalQuantity from database items
          categoryItemObject.forEach((ele) => {
            totalQuantity += ele.quantity;
            expiration_dates.push(ele._id);
          });

          console.log("Category  : ", category);
          // Calculate finalUnitPrice
          const finalUnitPrice =
            (newTotalQuantity * el.unitPrice + (category.unitPrice * category.totalQuantity)) / (totalQuantity);

          // Update the Category
          const finalTotalQuantity = totalQuantity;

          console.log("totalQuantity : ", totalQuantity)
          console.log("Expiration_Dates : ", expiration_dates)
          console.log("finalTotalQuantity : ", finalTotalQuantity, "finalUnitPrice :  ", finalUnitPrice)
          await Category.findByIdAndUpdate(el._id,
            {
              totalQuantity: finalTotalQuantity,
              unitPrice: finalUnitPrice,
              expirationDatesArr: expiration_dates
            }, { new: true }
          );
        }
      })
    );

    const finalObject = {
      type: type,
      //supply
      serialNumber: serial_nmber,
      invoiceCode,
      invoicesData: selectedOptionArr,
      supplierID,
      employeeID,
      registerDate,
      total_bill_price,
      supplyDate,
      supplyDateForSearch: forSearch,
      notes,
      quantity: 0,
    };


    let newInvoice = new Invoice(finalObject);
    console.log("newInvoice", newInvoice);
    await newInvoice.save();
    return {
      success: true
    }
    // res.status(201).send(newInvoice)
  } catch (error) {
    console.log('error', error);
    new Notification({ title: 'فشل في عملية الاضافة' }).show();
    return {
      success: false
    }
  }
});

// فاتورة صرف
ipcMain.handle('addPaymentInvoice', async (event, data) => {
  try {
    const {
      selectedOptionArr,
      supplierID,
      employeeID,
      registerDate,
      total_bill_price,
      supplyDate,
      notes,
      type,
      invoiceNumber
    } = data;

    let invoiceCode = 0;
    let lastInvoice = await Invoice.findOne({ type: "payment" }).sort({ createdAt: -1 });
   // console.log("OPBJECT : " , data)
    if(lastInvoice){
      const number =  Number(lastInvoice.invoiceCode.split("صرف (")[1].split(")")[0]) +1;
      invoiceCode = `صرف (${number})`;
    }else{
      invoiceCode = `صرف (1)`;
    }


    let serial_nmber = invoiceNumber;

    await Promise.all(
      selectedOptionArr?.map(async (el) => {
        console.log("Quantity For Category : ", el.totalQuantity)
        let ItemsObjectForCategory = await CategoryItem.find({ categoryID: el._id, });
        ItemsObjectForCategory = ItemsObjectForCategory.sort((a, b) => new Date(a.date) - new Date(b.date));
        let remaining = el.totalQuantity;

        for (let obj of ItemsObjectForCategory) {
          if (obj.quantity >= remaining) {
            obj.quantity -= remaining;
            remaining = 0;
          } else {
            remaining -= obj.quantity;
            obj.quantity = 0;

          }
          if (obj.quantity == 0) {
            await CategoryItem.findByIdAndDelete(obj._id);
          }
          else {
            await CategoryItem.findByIdAndUpdate(obj._id, { quantity: obj.quantity }, { new: true });
          }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const categoryItemList = await CategoryItem.find({ categoryID: el._id, });

        let totalQuantityForCategory = 0;
        let expiration_dates = [];
        categoryItemList.forEach((ele) => {
          // console.log("===  > ", ele.quantity)
          totalQuantityForCategory += ele.quantity;
          expiration_dates.push(ele._id);

        });

        const finalTotalQuantity = totalQuantityForCategory;
        await Category.findByIdAndUpdate(el._id, {
          totalQuantity: finalTotalQuantity,
          expirationDatesArr: expiration_dates

        }, { new: true });


      }),

    );

    const forSearch = new Date(supplyDate);

    const finalObject = {
      type: "payment",
      //supply
      serialNumber: serial_nmber,
      invoiceCode,
      total_bill_price,
      invoicesData: selectedOptionArr,
      supplierID,
      supplyDateForSearch: forSearch,
      employeeID,
      registerDate,
      supplyDate,
      notes,
      quantity: 0,
    };

    let newInvoice = new Invoice(finalObject);

    await newInvoice.save();
    return {
      success: true
    }
  } catch (error) {
    new Notification({ title: 'فشل في عملية الاضافة' }).show();
  }
});

// فاتورة تحويل
ipcMain.handle('changeInvoice', async (event, data) => {
  try {
    const {
      selectedOptionArr,
      selectedOptionArr2,
      supplierID,
      employeeID,
      registerDate,
      supplyDate,
      notes,
      total_payment_price,
      total_suplly_price,
      type,
      invoiceNumber
    } = data;

    console.log("TYPE  : ", type)

    let invoiceCode = 0;
    let lastInvoice = await Invoice.findOne({ type: "convert" }).sort({ createdAt: -1 });
   // console.log("OPBJECT : " , data)
    if(lastInvoice){
      const number =  Number(lastInvoice.invoiceCode.split("تحويل (")[1].split(")")[0]) +1;
      invoiceCode = `تحويل (${number})`;
    }else{
      invoiceCode = `تحويل (1)`;
    }




    let serial_nmber = invoiceNumber;


    await Promise.all(
      selectedOptionArr2?.map(async (el) => {
        let newTotalQuantity = 0; // Initialize newTotalQuantity
        let totalQuantity = 0;   // Initialize totalQuantity
        let category = await Category.findById(el._id);
        // Process expiration dates and save CategoryItem
        await Promise.all(
          el.expirationDatesArr.map(async (ele) => {
            newTotalQuantity += ele.quantity;
            const date2 = new Date(ele.date);
            date2.setUTCHours(0, 0, 0, 0);
            let date = date2.setDate(date2.getDate() - fiveDays);
            const date3 = new Date(date); // Convert to Date object
            const dateString = date3.toString();
            console.log("DATE ======>  ", date.toString());
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            const categoryItemObject = await CategoryItem.find({ categoryID: el._id });
            const dateE = new Date(ele.date);
            let timestamp = dateE.setDate(dateE.getDate() - fiveDays);
            const targetDate = new Date(timestamp);
            targetDate.setUTCHours(0, 0, 0, 0);
            const result = categoryItemObject.find(item => {
              const itemDate = new Date(item.date);
              itemDate.setUTCHours(0, 0, 0, 0);
              return itemDate.getFullYear() === targetDate.getFullYear() &&
                itemDate.getMonth() === targetDate.getMonth() && itemDate.getDate() === targetDate.getDate();
            });

            if (result) {
              console.log("EXIST  : ", "OLD : ", result.quantity, "NEW : ", ele.quantity);
              await CategoryItem.findByIdAndUpdate(result._id,
                { quantity: result.quantity + ele.quantity }, { new: true });
              return;
            } else {
              console.log("======== NOT EXIST ========");
              /////////////////////////////////////////////////////////////////////////////////////           
              let newCategoryItem = new CategoryItem({
                quantity: ele.quantity,
                date: dateString,
                categoryID: el._id,
              });
              await newCategoryItem.save();
            }
          })
        );






        const categoryItemObject = await CategoryItem.find({
          categoryID: el._id,
        });

        let expiration_dates = [];
        // Calculate totalQuantity from database items
        categoryItemObject.forEach((ele) => {
          totalQuantity += ele.quantity;
          expiration_dates.push(ele._id);
        });

        console.log("Category  : ", category);
        // Calculate finalUnitPrice
        const finalUnitPrice =
          (newTotalQuantity * el.unitPrice + (category.unitPrice * category.totalQuantity)) / (totalQuantity);

        // Update the Category
        const finalTotalQuantity = totalQuantity;

        console.log("totalQuantity : ", totalQuantity)
        console.log("Expiration_Dates : ", expiration_dates)
        console.log("finalTotalQuantity : ", finalTotalQuantity, "finalUnitPrice :  ", finalUnitPrice)
        await Category.findByIdAndUpdate(el._id,
          {
            totalQuantity: finalTotalQuantity,
            unitPrice: finalUnitPrice,
            expirationDatesArr: expiration_dates
          }, { new: true }
        );

      })
    );


    await Promise.all(
      selectedOptionArr?.map(async (el) => {
        console.log("Quantity For Category : ", el.totalQuantity)
        let ItemsObjectForCategory = await CategoryItem.find({ categoryID: el._id, });
        ItemsObjectForCategory = ItemsObjectForCategory.sort((a, b) => new Date(a.date) - new Date(b.date));
        let remaining = el.totalQuantity;

        for (let obj of ItemsObjectForCategory) {
          if (obj.quantity >= remaining) {
            obj.quantity -= remaining;
            remaining = 0;
          } else {
            remaining -= obj.quantity;
            obj.quantity = 0;

          }
          if (obj.quantity == 0) {
            await CategoryItem.findByIdAndDelete(obj._id);
          }
          else {
            await CategoryItem.findByIdAndUpdate(obj._id, { quantity: obj.quantity }, { new: true });
          }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const categoryItemList = await CategoryItem.find({ categoryID: el._id, });

        let totalQuantityForCategory = 0;
        let expiration_dates = [];
        categoryItemList.forEach((ele) => {
          // console.log("===  > ", ele.quantity)
          totalQuantityForCategory += ele.quantity;
          expiration_dates.push(ele._id);

        });

        const finalTotalQuantity = totalQuantityForCategory;
        await Category.findByIdAndUpdate(el._id, {
          totalQuantity: finalTotalQuantity,
          expirationDatesArr: expiration_dates

        }, { new: true });


      }),

    );

    const forSearch = new Date(supplyDate);
    const finalObject = {
      type: type ?? "convert",
      serialNumber: serial_nmber,
      invoiceCode,
      invoicesData: selectedOptionArr,
      invoicesData2: selectedOptionArr2,
      supplierID,
      employeeID,
      supplyDateForSearch: forSearch,
      total_payment_price,
      total_suplly_price,
      registerDate,
      supplyDate,
      notes,
      quantity: 0,
    };


    let newInvoice = new Invoice(finalObject);
    console.log("newInvoice", newInvoice);
    await newInvoice.save();
    return {
      success: true
    }
    // res.status(201).send(newInvoice)
  } catch (error) {
    console.log('error', error);
    new Notification({ title: 'فشل في عملية الاضافة' }).show();
    return {
      success: false
    }
  }
});

// حذف فاتورة
ipcMain.handle('deleteInvoice', async (event, data) => {
  try {
    let { invoiceCode } = data;

    await Invoice.findOneAndDelete({ invoiceCode });

    return {
      success: true
    }

  } catch (error) {
    console.log('error', error.message);
    return {
      success: false
    }
  }
});

// تعديل الفاتورة
ipcMain.handle('editInvoice',async(event,data)=>{
  try {
    let { invoiceCode,supplierID,supplyDate,invoiceNumber } = data;

    console.log('supplierID',supplierID?.toString());
    await Invoice.findOneAndUpdate(
      {invoiceCode},
      { $set: { 
        supplierID,
        supplyDate,
        serialNumber:invoiceNumber
       } 
      },
      {new:true}
    );

    return {
      success: true
    }
  } catch (error) {
    console.log('error', error.message);
    return {
      success: false
    }
  }
});

// اعادة تهيئة كود الفاتورة
ipcMain.handle('regenerateInvoiceCodes',async(event,data)=>{
  try {
      console.log("regenerateInvoiceCodes",data);
      let invoiceType=data?.invoiceType;
      let filter={ type: invoiceType };


      let invoices=await Invoice.find(filter);
      let invoiceCodeCount=1;

     // let pattern=
     // const number =  Number(lastInvoice.serialNumber.split("أضافه (")[1].split(")")[0]) +1;

      for(let oneInvoice of invoices){
        let invoiceCode;

       // if(invoiceType=="supply") number =  Number(oneInvoice.serialNumber.split("أضافه (")[1].split(")")[0]) +1;

      if(invoiceType=="supply") oneInvoice.invoiceCode = `أضافه (${invoiceCodeCount})`;
      if(invoiceType=="payment") oneInvoice.invoiceCode = `صرف (${invoiceCodeCount})`;
      if(invoiceType=="convert") oneInvoice.invoiceCode = `تحويل (${invoiceCodeCount})`;

      
     
        await oneInvoice.save();
      invoiceCodeCount++;

      }

      return {
        success: true
      }
      // await Promise.all(
      //   invoi
      // );

  } catch (error) {
    console.log('error', error.message);

    return {
      success: false
    }
  }
});

// بحث التقارير
ipcMain.handle('searchForReport', async (event, data) => {
  try {
    const { invoiceCode, supplierID, startDate, endDate, itemCode, type, isItem , isBeforeTransfare} = data;
    let categoryObject = [];
    let filter = {};

    if (supplierID) {
      filter.supplierID = supplierID;
    }
    if (itemCode) {
      if (startDate && endDate){
        categoryObject = await Invoice.find({
          $and: 
            [
             { supplyDateForSearch: { $gte: new Date(startDate), $lte: new Date(endDate)  }},
              {
                 $or: [
                   { invoicesData: { $elemMatch: { code: itemCode.toString() } } },
                   { invoicesData2: { $elemMatch: { code: itemCode.toString() } } }
                   ]
              }
            ]}).populate('supplierID employeeID').lean();
            return {
              success: true,
              categoryObject
            }
           }
           
           categoryObject = await Invoice.find({
               $or: [
          { invoicesData: { $elemMatch: { code: itemCode.toString() } } },
          { invoicesData2: { $elemMatch: { code: itemCode.toString() } } }
        ]
      }).populate('supplierID employeeID').lean();

      return {
        success: true,
        categoryObject
      }
    }
    if (type) {
      filter.type = type;
    }
    if (invoiceCode) {
      filter.invoiceCode = invoiceCode;
    }

    if (startDate && endDate) {

      filter.supplyDateForSearch = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

     categoryObject = await Invoice.find(filter).populate('supplierID employeeID').lean();
     
     let handleList = [];
     let handleList2 = [];
     let finalList = [];
     let finalList2 = [];
     let finalPrice = [];
     let finalPrice2 = [];
     let sums = {};
     let sums2 = {};
     if(isItem==true){
      await Promise.all(
        categoryObject.map(async(ele)=>{
          finalPrice.push(Number(ele.total_suplly_price));
          finalPrice2.push(Number(ele.total_payment_price));
          ele.invoicesData.map((ele2)=>{
            handleList.push({  itemName : ele2.name,  quantity : ele2.totalQuantity , code : ele2.code , unit : ele2.unit  }); }),
           ele.invoicesData2.map((ele2)=>{
            handleList2.push({  itemName : ele2.name,  quantity : ele2.totalQuantity , code : ele2.code , unit : ele2.unit }); })
          }),
        ),




          // Loop through each item
          handleList.forEach(item => {
            const key = `${item.itemName}-${item.code}-${item.unit}`; // Create a unique key for itemName and code
            if (!sums[key]) {
              sums[key] = { name: item.itemName, quantity: 0, code: item.code , unit: item.unit };
            }
            sums[key].quantity += item.quantity;
          });


          handleList2.forEach(item => {
            const key = `${item.itemName}-${item.code}-${item.unit}`; // Create a unique key for itemName and code
            if (!sums2[key]) {
              sums2[key] = { name: item.itemName, quantity: 0, code: item.code , unit: item.unit};
            }
            sums2[key].quantity += item.quantity;
          });




          finalList = Object.values(sums);
          finalList.push({finalPrice:finalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0)})

          finalList2 = Object.values(sums2);
          finalList2.push({finalPrice:finalPrice2.reduce((accumulator, currentValue) => accumulator + currentValue, 0)})
          console.log("DATA : " , finalList)
          console.log("DATA2 : " , finalList2)
          if(isBeforeTransfare==true){
            return {
              success: true,
              finalList:finalList2
            }
          }else{
            return {
              success: true,
              finalList
            }
          }
     
    }else{
      return {
        success: true,
        categoryObject
      }
     }
  } catch (error) {
    console.log('error', error);
    new Notification({ title: 'حدث خطأ حاول مرة اخري' }).show();
    return {
      success: false
    }
  }
});

// search for invoice by code
ipcMain.handle('searchForInvoiceByCode', async (event, data) => {
  try {
    const { code } = data;

    let foundInvoice = await Invoice.findOne({ invoiceCode: code }).populate('supplierID employeeID').lean();

    console.log('foundInvoice', foundInvoice);
    if (foundInvoice == null) {
      new Notification({ title: 'لا توجد فاتورة بهذا الكود ادخل كود اخر' }).show();
      return {
        success: false
      }
    }
    else {
      foundInvoice = {
        ...foundInvoice,
        _id: foundInvoice?._id?.toString(),
        supplierID: {
          ...foundInvoice?.supplierID,
          _id: foundInvoice?.supplierID?._id.toString()
        },
        employeeID: {
          ...foundInvoice?.employeeID,
          _id: foundInvoice?.employeeID?._id.toString()
        }
      }

      return {
        success: true,
        foundInvoice
      }
    }
  } catch (error) {
    console.log('error', error);
    new Notification({ title: 'حدث خطأ حاول مرة اخري' }).show();
    return {
      success: false
    }
  }
});

// get all notifications(today)
ipcMain.handle('getNotifications',async(event, data)=>{
  try {
    let notifications=await NotificationModel.find().populate('categoryID').lean();

    notifications=notifications?.map(el=>{
      return{
        ...el,
        _id:el?._id?.toString(),
        categoryID:{
          ...el?.categoryID,
          _id:el?.categoryID?._id?.toString()
        }
      }
    })

    return{
      success:true,
      notifications
    }
  } catch (error) {
    console.log('error',error.message);
    return{
      success:false
    }
  }
});

// post new notification
ipcMain.handle('postNewNotifications',async(event, data)=>{
  try {
   // await setupCronJob();

    return{
      success:true
    }
  } catch (error) {
    
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
