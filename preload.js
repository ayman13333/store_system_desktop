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
});
