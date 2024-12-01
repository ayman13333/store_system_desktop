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
const Invoice=require('./back/Models/Invoice');





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
    else {
      filter = [
        { type: data.type }
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
ipcMain.handle('getAllCategories', async (event, data) => {
  try {
    let categories = await Category.find()
      .populate('expirationDatesArr user')
      .sort({ createdAt: -1 })
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

      category.expirationDatesArr.sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending
      return category;
    });

    // console.log('categories',categories);

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

    if (expirationDatesArr.length == 0) return new Notification({ title: 'قم ب ادخال الاصناف' }).show();

    // الاول شوف الكود ده دخل قبل كدة ولا لا
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
    //  expirationDatesArr: expirationDatesArrIDS,
      totalQuantity: quantity
    }

    let newCategory = new Category(newCategoryObj);
    await newCategory.save();

    console.log('newCategory',newCategory);
    // 1) ضيف تواريخ الصلاحية في ال model
    let totalQuantity = 0;
    let expirationDatesArrIDS = [];

   await Promise.all(
      expirationDatesArr?.map(async (el) => {
        // console.log("el",el);
        totalQuantity += Number(el?.quantity);
        let newCategoryItem = new CategoryItem({
          ...el,
          categoryID:newCategory?._id
        });
        await newCategoryItem.save();

        newCategoryItem = newCategoryItem.toJSON();


        expirationDatesArrIDS.push(newCategoryItem?._id);

        console.log('CategoryItem saved:', newCategoryItem);
      })
    );

    newCategory.expirationDatesArr=expirationDatesArrIDS;

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
    let { expirationDatesArr, code, name, criticalValue, unitPrice, unit, quantity, lastCode, user, editDate , _id } = data;

    if (expirationDatesArr.length == 0) return new Notification({ title: 'قم ب ادخال الاصناف' }).show();

    // const oldCategory=await Category.findById(_id);

    if (code !== lastCode) {
      // الاول شوف الكود ده دخل قبل كدة ولا لا
      const foundCode = await Category.findOne({ code });
      if (foundCode !== null) {
        new Notification({ title: 'هذا الكود موجود بالفعل' }).show();
        return;
      }
    }


    const oldCategory = await Category.findById(_id);

     console.log('oldCategory',oldCategory);

    let oldCategoryItems = oldCategory?.expirationDatesArr;

    //1) امسح كل ال category items بتوع الصنف 
    const result = await CategoryItem.deleteMany({ _id: { $in: oldCategoryItems } });

    console.log('result', result);
    //2) save new category items

    // 1) ضيف تواريخ الصلاحية في ال model
    let totalQuantity = 0;
    let expirationDatesArrIDS = [];

    await Promise.all(
      expirationDatesArr?.map(async (el) => {
        // console.log("el",el);
        totalQuantity += Number(el?.quantity);
        let newCategoryItem = new CategoryItem({
          date:el?.date,
          quantity:el?.quantity,
          categoryID:oldCategory?._id
        });
        await newCategoryItem.save();

        newCategoryItem = newCategoryItem.toJSON();


        expirationDatesArrIDS.push(newCategoryItem?._id);

        console.log('CategoryItem saved:', newCategoryItem);
      })
    );

    console.log('expirationDatesArrIDS', expirationDatesArrIDS);
    console.log('totalQuantity', totalQuantity);

    //expirationDatesArrIDS= expirationDatesArrIDS.map(id => mongoose.Types.ObjectId(id));

    //2) ضيف الصنف
    let newCategoryObj = {
      code,
      name,
      criticalValue,
      unitPrice,
      unit,
      expirationDatesArr: expirationDatesArrIDS,
      totalQuantity: quantity,
      user,
      editDate
    }

    console.log('newCategoryObj',newCategoryObj);

    // let newCategory=new Category(newCategoryObj);

    // await newCategory.save();

    let newCategory= await Category.findByIdAndUpdate(
      oldCategory?._id,
      newCategoryObj,
      {
        new: true
      }
    );

    console.log('newCategory',newCategory);

    if(newCategory==null) 
    return{
      success:false
    }
    else
    return {
      success: true
    };




  } catch (error) {
    console.log("error",error);
    new Notification({ title: 'فشل في عملية التعديل' }).show();
  }
});

// فاتورة توريد
ipcMain.handle('addSupplyInvoice', async (event, data) => {
  try {
    let serial_nmber = 0;
    const{
      invoiceCode,
      selectedOptionArr,
      supplierID,
      employeeID,
      registerDate,
      supplyDate,
      notes,
      totalQuantity,
      type
    }=data;

    console.log("TYPE  : " , type)
    const invoiceObject = await Invoice.find().sort({createdAt : -1});

   // console.log('invoiceObject',invoiceObject);
    const invoiceCodeCheck = await Invoice.findOne({invoiceCode});
    if(invoiceCodeCheck){
        
      new Notification({ title: 'هذا الكود مسجل من قبل' }).show();
          return{  success:false  }
      //  return res.send("Invoice Code Is Here")
    }

    console.log('bbbbbbbbbbbbbbbbb');    
    if(invoiceObject.length>0){     serial_nmber =invoiceObject[0].serialNumber + 1;    }
    else{ serial_nmber = 1; }


    await Promise.all(
      selectedOptionArr?.map(async (el) => {
        let newTotalQuantity = 0; // Initialize newTotalQuantity
        let totalQuantity = 0;   // Initialize totalQuantity
        
        // Process expiration dates and save CategoryItem
        await Promise.all(
          el.expirationDatesArr.map(async (ele) => {
            newTotalQuantity += ele.quantity;

            let newCategoryItem = new CategoryItem({
              quantity: ele.quantity,
              date: ele.date,
              categoryID: el._id,
            });
            await newCategoryItem.save();
          })
        );

        if (type === "supply") {

          const categoryItemObject = await CategoryItem.find({
            categoryID: el._id,
          });

          // Calculate totalQuantity from database items
          categoryItemObject.forEach((ele) => {
            totalQuantity += ele.quantity;
          });

          // Calculate finalUnitPrice
          const finalUnitPrice =
            (newTotalQuantity * el.unitPrice + el.originalQuantity) / (newTotalQuantity + el.originalQuantity);

          // Update the Category
          const finalTotalQuantity = totalQuantity + newTotalQuantity;

          console.log("totalQuantity : " , totalQuantity , "newTotalQuantity :  " , newTotalQuantity)
          console.log("finalTotalQuantity : " , finalTotalQuantity , "finalUnitPrice :  " , finalUnitPrice)
          await Category.findByIdAndUpdate( el._id,
            {
              totalQuantity: finalTotalQuantity,
              unitPrice: finalUnitPrice,
            },  { new: true }
          );
        }
      })
    );

      const finalObject = {
        type: type,
        //supply
        serialNumber :serial_nmber,
        invoiceCode,
        invoicesData : selectedOptionArr,
        supplierID,
        employeeID,
        registerDate,
        supplyDate,
        notes,
        quantity: totalQuantity,
      };      
      
     
      let newInvoice=new Invoice(finalObject);
      console.log("newInvoice",newInvoice);
      await newInvoice.save();
      console.log('ggggggggggggggg');

      return{
        success:true
      }
      // res.status(201).send(newInvoice)
  } catch (error) {
    console.log('error',error);
    new Notification({ title: 'فشل في عملية الاضافة' }).show();
    return{
      success:false
    }
  }
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
