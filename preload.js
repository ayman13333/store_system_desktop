const { contextBridge, ipcRenderer } = require('electron');

//  get-all-rooms
contextBridge.exposeInMainWorld('electron', {

  login:(data)=>ipcRenderer.invoke('login',data),
  // users
  addUser:(userData)=>ipcRenderer.invoke('add-user',userData),
  getOneUser:(userData)=>ipcRenderer.invoke('get-one-user',userData),
  getAllUsers:(data)=>ipcRenderer.invoke('getAllUsers',data),
  editUser:(data)=>ipcRenderer.invoke('editUser',data),
  editGuest:(data)=>ipcRenderer.invoke('editGuest',data),
  // الاصناف
  addCategory:(data)=>ipcRenderer.invoke('addCategory',data),
  getAllCategories:(data)=>ipcRenderer.invoke('getAllCategories',data),
  editCategory:(data)=>ipcRenderer.invoke('editCategory',data),
  addSupplyInvoice:(data)=>ipcRenderer.invoke('addSupplyInvoice',data),
  addPaymentInvoice:(data)=>ipcRenderer.invoke('addPaymentInvoice',data),
  changeInvoice:(data)=>ipcRenderer.invoke('changeInvoice',data),
  searchForReport:(data)=>ipcRenderer.invoke('searchForReport',data),
  // صفحة الطباعة
  searchForInvoiceByCode:(data)=>ipcRenderer.invoke('searchForInvoiceByCode',data),
  // حذف فاتورة
  deleteInvoice:(data)=>ipcRenderer.invoke('deleteInvoice',data),
  // الاشعارات   
  getNotifications:(data)=>ipcRenderer.invoke('getNotifications',data),
  // postNewNotifications
  postNewNotifications:(data)=>ipcRenderer.invoke('postNewNotifications',data),
});


