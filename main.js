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







// let requestQueue = Promise.resolve();


// // add book
// ipcMain.handle('add-book', async (event, data) => {
//   //queue.add()
//   // const queue=createQueue();
//   requestQueue = requestQueue.then(async () => {
//     try {

//       if (data.type == '0') return new Notification({ title: 'من فضلك اختر تصنيف العميل' }).show();

//       let serialNumber;
//       //  serialNumber = await Book.countDocuments();

//       //  serialNumber=serialNumber+1;

//       let lastBook = await Book.findOne().sort({ createdAt: -1 });

//       console.log('lastBook', lastBook);
//       console.log('lastBook.serialNumber', lastBook.serialNumber);
//       // return;

//       if (lastBook == null) serialNumber = 1000;
//       else serialNumber = Number(lastBook.serialNumber) + 1;

//       //console.log('ggggggggggggggggggggggggggg');
//       let newBook = new Book({ ...data, serialNumber });

//       await newBook.save();

//       await newBook.populate('userID roomID');

//       console.log('book saved:', newBook);

//       let to = new Date(newBook?.to);
//       to = to.setDate(to.getDate() + 1);
//       to = new Date(to);

//       newBook = {
//         ...newBook.toObject(),
//         to
//       }

//       new Notification({ title: 'تم الحجز بنجاح' }).show();

//       return {
//         success: true, newBook
//       };
//     } catch (error) {
//       // new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//       new Notification({ title: 'فشل في الحجز' }).show();
//       return { success: false, error: error.message };
//     }
//   });

//   return requestQueue; // Return the queued promise

// });



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
  // const startUrl = path.join(__dirname,'my-app','build','index.html');
  //  mainWindow.loadFile(startUrl);
}

app.whenReady().then(async () => {
  await connectDB();
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
    else{
      filter=[
        {type:data.type}
      ];
    }
    let users = await User.find({
      $or: filter
    }).lean();

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
    if(data.type) updateObj.type=data.type;

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

    let user = await User.findByIdAndUpdate(id, data, {
      new: true
    }).lean();

    // console.log("user",user);
    user = {
      ...user,
      _id: user?._id.toString()
    }
    new Notification({ title: 'تم تعديل المستخدم بنجاح' }).show();

    return {
      success: true,
      user
    }

  } catch (error) {

    new Notification({ title: 'فشل في عملية التعديل' }).show();

  }
});

// الاصناف (categories)
ipcMain.handle('getAllCategories',async(event,data)=>{
  try {
    let categories=await Category.find().lean();

    // convert objectid to string
    categories=categories?.map(el=>{
      return{
        ...el,
        _id:el?._id?.toString()
      }
    })

   // console.log('categories',categories);

    return{
      success:true,
      categories
    }

  } catch (error) {
    console.log(error);
    new Notification({ title: 'حدث مشكلة اثناء الاتصال بالانترنت' }).show();

    return{
      success:false
    };
  }
});

// 1) add category
ipcMain.handle('addCategory',async(event,data)=>{
  try {
    let{expirationDatesArr,code,name,criticalValue,unitPrice,unit,quantity}=data;

    if(expirationDatesArr.length==0) return new Notification({ title: 'قم ب ادخال الاصناف' }).show();

    // الاول شوف الكود ده دخل قبل كدة ولا لا
    const foundCode = await Category.findOne({ code });
      if (foundCode !== null) {
        new Notification({ title: 'هذا الكود موجود بالفعل' }).show();
        return;
      }

    // 1) ضيف تواريخ الصلاحية في ال model
    let totalQuantity=0;
    let expirationDatesArrIDS=[];

    await Promise.all(
      expirationDatesArr?.map(async(el)=>{
       // console.log("el",el);
        totalQuantity+= Number(el?.quantity);
        let newCategoryItem = new CategoryItem(el);
        await newCategoryItem.save();
        
        newCategoryItem=newCategoryItem.toJSON();

        
        expirationDatesArrIDS.push(newCategoryItem?._id);

        console.log('CategoryItem saved:', newCategoryItem);
      })
    );

    console.log('expirationDatesArrIDS',expirationDatesArrIDS);
    console.log('totalQuantity',totalQuantity);

   //expirationDatesArrIDS= expirationDatesArrIDS.map(id => mongoose.Types.ObjectId(id));

    //2) ضيف الصنف
    let newCategoryObj={
      code,
      name,
      criticalValue,
      unitPrice,
      unit, 
      expirationDatesArr:expirationDatesArrIDS,
      totalQuantity:quantity
    }

    let newCategory=new Category(newCategoryObj);

    await newCategory.save();

    return {
      success: true
    };
  } catch (error) {
    
    console.log(error);
    new Notification({ title: 'فشل في عملية الاضافة' }).show();

    return{
      success:false
    };

  }
})




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
