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
// const { fiveDays } = require('./front/src/Constants');

const fiveDays = 5;



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
    if(userData.type=='supplier'){
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

    console.log('users',users);


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
    if(data.type=='supplier'){
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

    console.log('newCategory', newCategory);
    // 1) ضيف تواريخ الصلاحية في ال model
    let totalQuantity = 0;
    let expirationDatesArrIDS = [];

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

    console.log('oldCategory', oldCategory);

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
          date: el?.date,
          quantity: el?.quantity,
          categoryID: oldCategory?._id
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

    console.log('newCategoryObj', newCategoryObj);

    // let newCategory=new Category(newCategoryObj);

    // await newCategory.save();

    let newCategory = await Category.findByIdAndUpdate(
      oldCategory?._id,
      newCategoryObj,
      {
        new: true
      }
    );

    console.log('newCategory', newCategory);

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
      invoiceCode,
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

    const forSearch =new Date(supplyDate);

    const invoiceCodeCheck = await Invoice.findOne({ invoiceCode });
    if (invoiceCodeCheck) {

      new Notification({ title: 'هذا الكود مسجل من قبل' }).show();
      return { success: false }
      //  return res.send("Invoice Code Is Here")
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
              console.log("Target : "  ,targetDate)
              const itemDate = new Date(item.date);
              itemDate.setUTCHours(0, 0, 0, 0);
              console.log("Item : "  ,itemDate)
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
      supplyDateForSearch : forSearch ,
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
      invoiceCode,
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

    const invoiceCodeCheck = await Invoice.findOne({ invoiceCode });
    if (invoiceCodeCheck) {
      new Notification({ title: 'هذا الكود مسجل من قبل' }).show();
      return { success: false }
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

    const forSearch =new Date(supplyDate);

    const finalObject = {
      type: "payment",
      //supply
      serialNumber: serial_nmber,
      invoiceCode,
      total_bill_price,
      invoicesData: selectedOptionArr,
      supplierID,
      supplyDateForSearch : forSearch ,
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
ipcMain.handle('changeInvoice',async(event, data)=>{
  try {
    const {
      invoiceCode,
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

    const invoiceCodeCheck = await Invoice.findOne({ invoiceCode });
    if (invoiceCodeCheck) {
      new Notification({ title: 'هذا الكود مسجل من قبل' }).show();
      return { success: false }
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
   
    const forSearch =new Date(supplyDate);
    const finalObject = {
      type: type,
      //supply
      serialNumber: serial_nmber,
      invoiceCode,
      invoicesData: selectedOptionArr,
      invoicesData2: selectedOptionArr2,
      supplierID,
      employeeID,
      supplyDateForSearch : forSearch ,
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
ipcMain.handle('deleteInvoice',async(event, data)=>{
  try {
    let{invoiceCode}=data;

    await Invoice.findOneAndDelete({invoiceCode});

    return{
      success:true
    }

  } catch (error) {
    console.log('error',error.message);
    return{
      success:false
    }
  }
});
// بحث التقارير
ipcMain.handle('searchForReport', async (event, data) => {
  try {
    const { invoiceCode, supplierID, startDate, endDate } = data;

    let filter = {};

    if (supplierID) {
      filter.supplierID = supplierID;
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
    let categoryObject = await Invoice.find(filter).populate('supplierID employeeID').lean();
    
    return {
      success: true,
      categoryObject
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
ipcMain.handle('searchForInvoiceByCode',async(event, data)=>{
  try {
    const{code}=data;
   
    let foundInvoice=await Invoice.findOne({invoiceCode:code}).populate('supplierID employeeID').lean();

    console.log('foundInvoice',foundInvoice);
    if(foundInvoice==null){
      new Notification({ title: 'لا توجد فاتورة بهذا الكود ادخل كود اخر' }).show();
      return {
        success:false
      }
    }
    else{
      foundInvoice={
        ...foundInvoice,
        _id:foundInvoice?._id?.toString(),
        supplierID:{
          ...foundInvoice?.supplierID,
          _id:foundInvoice?.supplierID?._id.toString()
        },
        employeeID:{
          ...foundInvoice?.employeeID,
          _id:foundInvoice?.employeeID?._id.toString() 
        }
      }

      return{
        success:true,
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
