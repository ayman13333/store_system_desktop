import './App.css';
import {  HashRouter, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

// components and pages
import Login from './Pages/Login';
import AllItemsPage from './Pages/items/AllItemsPage';
import AddItemPage from './Pages/items/AddItemPage';
import AllUsersPage from './Pages/users/AllUsersPage';
import GuestsPage from './Pages/users/GuestsPage';



function App() {
  return (
    <div className="App">
     <HashRouter>
      <Routes>
      <Route index element={<Login />} />
      {/* الموظفين */}
      <Route path='/users' element={<AllUsersPage />} />
      {/* الموردين */}
      <Route path='/guests' element={<GuestsPage />} />

      {/* الاصناف */}
      <Route path='/allitems' element={<AllItemsPage />} />
      {/* اضافة صنف */}
      <Route path='/allitems/add' element={<AddItemPage />} />
      </Routes>

     <ToastContainer />
     </HashRouter>
    </div>
  );
}

export default App;
