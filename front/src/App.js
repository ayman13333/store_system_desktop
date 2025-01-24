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
import ConvetInvoicePage from './Pages/invoices/ConvetInvoicePage';
import InventoryReportPage from './Pages/reports/InventoryReportPage';
import InventoryReportWithoutPricePage from './Pages/reports/InventoryReportWithoutPricePage';
import EntityTransactionReportPage from './Pages/reports/EntityTransactionReportPage';
import ItemTransactionReportPage from './Pages/reports/ItemTransactionReportPage';
import FinancialTransactionsReportPage from './Pages/reports/FinancialTransactionsReportPage';
import PrintInvoicePage from './Pages/print/PrintInvoicePage';
import NavBar from './Utilities/NavBar';
import { useContext, useState } from 'react';
import EntityTransactionItemsReportPage from './Pages/reports/EntityTransactionItemsReportPage';
import {MyContext} from "./index";

// import PrintPayentandSupplyInvoice from './components/print/PrintPayentandSupplyInvoice';




function App() {
  // const location = useLocation();
  const { isLogin,setIsLogin } = useContext(MyContext);
  // const[isLogin,setIsLogin]=useState(false);

   console.log('location',window.location.href);
    const loggedUser = JSON.parse(localStorage.getItem('user'));

   


  return (
    <div className="App">
      {(isLogin)&& <NavBar />}  
      {/* <NavBar /> */}
     <HashRouter>
      <Routes>
      
      <Route index element={<Login setIsLogin={setIsLogin} />} />
      {/* الموظفين */}
      <Route path='/users' element={<AllUsersPage />} />
      {/* الجهات */}
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
      {/* فاتورة تحويل */}
      <Route path='/convertInvoice' element={<ConvetInvoicePage />} />


      {/* التقرير */}
      {/*  تقرير جرد مسعر */}
      <Route path='/inventoryReport' element={<InventoryReportPage />} />
      
      {/*  تقرير جرد  */}

      <Route path='/InventoryReportWithoutPrice' element={<InventoryReportWithoutPricePage />} />

      {/* تقرير معاملات الجهة */}

      <Route path='/EntityTransactionReport' element={<EntityTransactionReportPage />} />
      <Route path='/EntityTransactionItemsReport' element={<EntityTransactionItemsReportPage />} />


      {/*  تقرير معاملات الصنف */}
      <Route path='/ItemTransactionReport' element={<ItemTransactionReportPage />} />

      {/* تقرير المعاملات المالية */}
      <Route path='/FinancialTransactionsReport' element={<FinancialTransactionsReportPage />} />

      {/* صفحة الطباعة */}
      <Route path='/print' element={<PrintInvoicePage />} />
      {/* طباعة فاتورة التوريد والصرف */}
      {/* <Route path='/printPayentandSupplyInvoice' element={<PrintPayentandSupplyInvoice />} /> */}

      </Routes>
     </HashRouter>

     <ToastContainer />
    </div>
  );
}

export default App;
