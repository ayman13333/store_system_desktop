 const { app, BrowserWindow, ipcMain, Notification, screen } = require('electron');
// const url = require('url');
 const path = require('path');
 const connectDB = require('./back/db'); // Import the database connection
 const _ = require('lodash');



 const bcrypt = require('bcrypt');
// const Room = require('./front/src/Models/Rooms');
const User = require('./back/Models/User');
// const Book = require('./front/src/Models/Books');

// // const PQueue = require('p-queue');
// // // import PQueue from 'p-queue';
// // const queue = new PQueue({ concurrency: 1 });

// //let queue;




// let requestQueue = Promise.resolve();


// async function createMainWindow() {

//   const { width, height } = screen.getPrimaryDisplay().workAreaSize;

//   const mainWindow = new BrowserWindow({
//     title: 'جاردينيا',
//     width: Math.min(width, 1000),
//     height: Math.min(height, 1000),
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: true,
//       preload: path.join(__dirname, 'preload.js'),
//       webSecurity: false
//     }
//   });

//   // delete all users except admin
//   // await User.deleteMany({ type: { $ne: 'admin' } });



//   // 'http://localhost:3000'

//   // mainWindow.webContents.openDevTools();
//   // mainWindow.loadURL('http://localhost:3000');

//   // production
//   const startUrl = path.join(__dirname,'my-app','build','index.html');
//    mainWindow.loadFile(startUrl);

// }

// app.whenReady().then(async () => {
//   await connectDB(); // Connect to the database
//   createMainWindow();
// });

// //app.whenReady().then(createMainWindow);



// // rooms
// ipcMain.handle('create-room', async (event, userData) => {
//   try {

//     //console.log('ggggggggggggggggggggggggggg');
//     const newRoom = new Room(userData);
//     await newRoom.save();

//     console.log('newRoom saved:', newRoom);

//     new Notification({ title: 'Room Created' }).show();

//     return { success: true, newRoom: { ...newRoom.toObject() } };
//   } catch (error) {
//     new Notification({ title: 'فشل في عملية الاضافة' }).show();

//     return { success: false, error: error.message };
//   }
// });

// ipcMain.handle('edit-room', async (event, userData) => {
//   try {
//     //console.log('userData', userData);
//     let room = await Room.findByIdAndUpdate(userData?._id, {
//       room_number: userData?.room_number,
//       type: userData?.type,
//       priceForUser: userData?.priceForUser,
//       priceForArmy: userData?.priceForArmy,
//       priceForDarMember: userData?.priceForDarMember
//     }, {
//       new: true
//     });

//     console.log('room updated', room);

//     new Notification({ title: 'Room updated' }).show();

//     return { success: true, newRoom: { ...room.toObject() } };
//   } catch (error) {
//     new Notification({ title: 'فشل في عملية التعديل' }).show();

//     return { success: false, error: error.message };
//   }
// });


// ipcMain.handle('get-all-rooms', async (event, userData) => {
//   try {
//     let rooms = await Room.find().lean();

//     rooms = rooms.map(doc => {
//       return {
//         ...doc,
//         _id: doc._id.toString()
//       }
//     });

//     return { success: true, rooms };

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     return { success: false, error: error.message };
//   }
// });







// ipcMain.handle('get-one-user', async (event, userData) => {
//   try {
//     const user = await User.findOne({ cardNumber: userData?.cardNumber }).lean();

//     if (user == null) return new Notification({ title: 'هذا العميل غير موجود' }).show();

//     console.log('user', user);
//     let doc = {
//       ...user,
//       _id: user._id.toString()
//     }

//     console.log('doc', doc);

//     return doc;
//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//   }
// });

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

// // search for empty rooms
// ipcMain.handle('search-for-room', async (event, data) => {
//   try {
//     let from = data.from;
//     let to = data.to;

//     // to = new Date(data.to);
//     // to = to.setDate(to.getDate() + 1);
//     // to = new Date(to);

//     console.log('to', to);


//     //   to=to.setDate(to.getDate() - 1);

//     console.log('from', from);

//     let Booked_rooms = await Book.find({
//       $or: [
//         { from: { $lte: to }, to: { $gte: from } }
//       ],
//       disabled: false

//       // from:{$gte: new Date(from) ,$lte: new Date(to)},
//       //  to:{ $gte: new Date(from), $lte: new Date(to)}
//     });

//     // console.log('Booked_rooms',Booked_rooms);


//     const rooms = await Room.find().lean();

//     let empty_rooms = [];

//     let empty_room_count = 0;
//     let booked_room_count = 0;
//     let all_rooms = rooms.length;

//     empty_rooms = rooms?.filter(room => {
//       let foundRoom = Booked_rooms.find(el => el?.roomID.toString() == room?._id.toString());
//       if (foundRoom?.serialNumber) {
//         booked_room_count += 1;
//       }
//       else {
//         return room;
//       }
//       // console.log("foundRoom", foundRoom);
//     })



//     empty_rooms = empty_rooms.map(doc => {
//       return {
//         ...doc,
//         _id: doc._id.toString()
//       }
//     });

//     // empty_rooms;

//     // console.log('empty_rooms', empty_rooms);

//     empty_room_count = all_rooms - booked_room_count;
//     empty_rooms = _.uniqBy(empty_rooms, '_id');


//     return {
//       success: true, rooms: {
//         empty_rooms
//       },
//       booked_room_count,
//       empty_room_count
//     };

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     console.log('error');
//     console.log(error.message);
//   }
// });

// // search for book(bill)   البحث عن فاتورة
// // cardNumber
// // serialNumber
// ipcMain.handle('search-for-book', async (event, data) => {
//   try {
//     if (data.value == '' || data.type == '') return new Notification({ title: 'من فضلك اكمل البيانات' }).show();
//     console.log('data', data);
//     let query = {};
//     if (data.type == 'cardNumber') query.cardNumber = data.value;
//     if (data.type == 'serialNumber') query.serialNumber = data.value;

//     console.log('query', query);

//     // query.status='حجز جديد';

//     let book = await Book.findOne(query).populate('userID roomID prevRoomID').sort({ createdAt: -1 }).lean();

//     if (book == null) new Notification({ title: 'تأكد من ادخال البيانات بشكل صحيح' }).show();

//     console.log('book', book);

//     // to=book?.to;

//     let to = new Date(book?.to);
//     to = to.setDate(to.getDate() + 1);
//     to = new Date(to);


//     book = {
//       ...book,
//       to,
//       _id: book?._id.toString(),
//       userID: {
//         ...book.userID,
//         _id: book.userID._id.toString()
//       },
//       roomID: {
//         ...book.roomID,
//         _id: book.roomID._id.toString()
//       },
//       prevRoomID: {
//         ...book.prevRoomID,
//         _id: book?.prevRoomID?._id.toString()
//       }
//     }
//     return {
//       success: true,
//       book: book
//     }

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//   }
// });

// // update pill
// ipcMain.handle('updatePill', async (event, data) => {
//   try {
//     const id = data?._id;
//     // data=data.delete('_id');
//     delete data['_id'];

//     // الغاء الحجز
//     // const isCanceledBook = await Book.findById(id);

//     // if (isCanceledBook?.status == 'الغاء الحجز') return new Notification({ title: 'تم الغاء حجز هذا الايصال بالفعل' }).show();

//     // console.log('id', id);

//     if (data.ensurancePrice == '') data.ensurancePrice = 0;
//     if (data.extraPrice == '') data.extraPrice = 0;
//     if (data.subEnsurancePrice == '') data.subEnsurancePrice = 0;
//     if (data.cancelPrice == '') data.cancelPrice = 0;
//     if (data.earlyLeavePrice == '') data.earlyLeavePrice = 0;





//     let book = await Book.findByIdAndUpdate(id, {
//       ...data
//     }, {
//       new: true
//     })
//       .populate('userID roomID prevRoomID')
//       .lean();

//     console.log('book updated', book);

//     let to = new Date(book?.to);
//     to = to.setDate(to.getDate() + 1);
//     to = new Date(to);

//     book = {
//       ...book,
//       to
//     }

//     book = { ...book, _id: book._id.toString() }

//     // new Notification({ title: 'Room updated' }).show();

//     return { success: true, book: { ...book } };
//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     console.log("error", error.message);
//   }
// });

// // get last bill serial number
// ipcMain.handle('getLastPill', async (event, data) => {
//   try {
//     let book = await Book.findOne().populate('userID roomID prevRoomID').sort({ createdAt: -1 }).lean();

//     console.log('last book', book);

//     book = {
//       ...book,
//       _id: book?._id?.toString()
//     }

//     return {
//       success: true,
//       book
//     }

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     console.log("error", error.message);

//   }
// });
// // let book = await Book.findOne(query).populate('userID roomID prevRoomID').sort({createdAt:-1}).lean();

// ipcMain.handle('getArcheives', async (event, data) => {

//   try {
//     let from = data.from;
//     let to = data.to;

//     // to = new Date(data.to);
//     // to = to.setDate(to.getDate() + 1);
//     // to = new Date(to);

//     // to=new Date(to);

//     console.log('to', to);


//     //   to=to.setDate(to.getDate() - 1);

//     console.log('from', from);

//     let query = {
//       $and: [
//         // { from: { $lte: to }, to: { $gte: from } }
//         { to: { $lte: to }, from: { $gte: from } }


//       ]
//     };


//     if (data.type == 'cardNumber') query.cardNumber = data.value;
//     if (data.type == 'roomNumber') query.roomNumber = data.value;
//     if (data.type == 'userName') {
//       let name = data.value.trim();
//       const regex = new RegExp(name, 'i');
//       query.userName = regex;
//     }



//     //query;

//     console.log('query', query);

//     // userID: new ObjectId('66a1939d302c3682f6b5b665'),
//     // roomID
//     let results = await Book.find(query).populate('userID roomID').lean();


//     results = results.map(doc => {
//       let to = new Date(doc?.to);
//       to = to.setDate(to.getDate() + 1);
//       to = new Date(to);

//       return {
//         ...doc,
//         to,
//         userID: {
//           ...doc.userID,
//           _id: doc.userID._id.toString()
//         },
//         roomID: {
//           ...doc.roomID,
//           _id: doc.roomID._id.toString()
//         },
//         _id: doc._id.toString()
//       }
//     });

//     console.log('results', results);

//     return {
//       success: true,
//       results
//     }

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     console.log('error', error.message);
//   }
// });


// // delete pill
// ipcMain.handle('deletePill', async (event, data) => {
//   try {
//     const id = data.id;
//     let deletedBook = await Book.findByIdAndDelete(id);

//     return {
//       success: true, deletedBook
//     };

//   } catch (error) {
//     new Notification({ title: 'حدث خطأ في الاتصال بالانترنت' }).show();

//     console.log('error', error.message);
//   }
// });

// // if (error.errno == '-4077')



// test 


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

  // const users=await User.find();

  // console.log('users',users);

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

    // if (userData.typeOfUser == 'user') {
    //   const foundUser = await User.findOne({ cardNumber: userData.cardNumber });
    //   console.log('foundUser', foundUser);
    //   if (foundUser !== null) {
    //     new Notification({ title: 'رقم البطاقة موجود بالفعل' }).show();
    //     return;
    //   }
    // }

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
    if (data.type == 'supplier') {
      filter = [
        { type: 'consumer' },
        { type: 'supplier' },
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





app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
