import './App.css';
import {  HashRouter, Route, Routes } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

// components and pages
import Login from './Pages/Login';
import AllItemsPage from './Pages/items/AllItemsPage';
import AddItemPage from './Pages/items/AddItemPage';
import AllUsersPage from './Pages/users/AllUsersPage';
import GuestsPage from './Pages/users/GuestsPage';
import { ToastContainer } from 'react-toastify';
import SupplyInvoicePage from './Pages/invoices/SupplyInvoicePage';
import PaymentInvoicePage from './Pages/invoices/PaymentInvoicePage';



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
    {/* تعديل صنف */}
      <Route path='/allitems/edit' element={<AddItemPage />} />

      {/* فاتورة توريد */}
      <Route path='/supplyInvoice' element={<SupplyInvoicePage />} />

      {/* فاتورة صرف */}
      <Route path='/paymentInvoice' element={<PaymentInvoicePage />} />
      </Routes>
     </HashRouter>

     <ToastContainer />
    </div>
  );
}

export default App;
