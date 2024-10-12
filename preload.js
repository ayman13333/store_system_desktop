const { contextBridge, ipcRenderer } = require('electron');

//  get-all-rooms
contextBridge.exposeInMainWorld('electron', {

  login:(data)=>ipcRenderer.invoke('login',data),
  // rooms
  createRoom: (userData) => ipcRenderer.invoke('create-room', userData),
  getAllRooms:()=>ipcRenderer.invoke('get-all-rooms'),
  editRoom:(userData) => ipcRenderer.invoke('edit-room', userData),
  // users
  addUser:(userData)=>ipcRenderer.invoke('add-user',userData),
  getOneUser:(userData)=>ipcRenderer.invoke('get-one-user',userData),
  getAllUsers:(data)=>ipcRenderer.invoke('getAllUsers',data),
  // bookings
  addBook:(data)=>ipcRenderer.invoke('add-book',data),
  searchForRoom:(data)=>ipcRenderer.invoke('search-for-room',data),
  searchForBook:(data)=>ipcRenderer.invoke('search-for-book',data),
  updatePill:(data)=>ipcRenderer.invoke('updatePill',data),
  editUser:(data)=>ipcRenderer.invoke('editUser',data),
  editGuest:(data)=>ipcRenderer.invoke('editGuest',data),
  getLastPill:(data)=>ipcRenderer.invoke('getLastPill',data),
  getArcheives:(data)=>ipcRenderer.invoke('getArcheives',data),
  deletePill:(data)=>ipcRenderer.invoke('deletePill',data)
});
