//import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdBedroomParent, MdLogout, MdModeEdit } from "react-icons/md";
import { BsBackpack4Fill, BsFillFilePersonFill, BsFillPersonVcardFill, BsGlobeCentralSouthAsia } from "react-icons/bs";
import { FaFileInvoice, FaPrint } from "react-icons/fa";
import { Accordion, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import CustomDropDown from './CustomDropDown';
import { HiDocumentReport } from "react-icons/hi";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  //  console.log('lllll', localStorage.getItem('type'));
  const pillsOptions = [
    { value: 'فاتورة توريد', to: '/supplyInvoice' },
    { value: 'فاتورة صرف', to: '/paymentInvoice' },
    { value: 'فاتورة تحويل', to: '/convertInvoice' }

  ]; 

  const reportsOptions=[
    { value: ' تقرير جرد ', to: '/InventoryReportWithoutPrice' },
    { value: ' تقرير جرد مسعر', to: '/inventoryReport' },
    { value: ' تقرير معاملات الجهة', to: '/EntityTransactionReport' },
    { value: ' تقرير معاملات الصنف', to: '/ItemTransactionReport' },
    { value: 'تقرير الفواتير ', to: '/FinancialTransactionsReport' },
  ]; 



  // const type = localStorage.getItem('type');

  const loggedUser = JSON.parse(localStorage.getItem('user'));


  return (
    <div style={{ width: '20%', backgroundColor: '#212529', color: 'white' }}>
      <div className='p-2 sidebar'>
        <h4 className='my-3 text-center'> لوحة التحكم </h4>

        <p className='text-right my-3'>   <BsFillFilePersonFill />  {localStorage.getItem('email')} </p>



        <NavLink className='link my-2' to={'/allitems'}>
          <span> <BsBackpack4Fill />    مخزن الاغذية و المشروبات  </span>
        </NavLink>

        {
          loggedUser?.type != "storekeeper" && <>
            <NavLink className='link my-3' to={'/users'}>
              <span style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BsGlobeCentralSouthAsia />
                </div>
                <div>
                  ادارة الموظفين
                </div>
              </span>
            </NavLink>

            <NavLink className='link my-3' to={'/guests'}>
              <span style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BsFillPersonVcardFill />
                </div>
                <div>
                  سجل الجهات
                </div>
              </span>
            </NavLink>

            <NavLink className='link my-3' to={'/print'}>
              <span style={{ display: "flex", gap: "10px" }}>
                <div>
                <FaPrint />
                </div>
                <div>
                   طباعة فاتورة
                </div>
              </span>
            </NavLink>


            <Nav.Item>
              <CustomDropDown
                title={'الفواتير'}
                id={'invoices'}
                iconTitle={<FaFileInvoice style={{ margin: 'auto' }} />}
                options={pillsOptions}
              />
            </Nav.Item>

            <Nav.Item>
              <CustomDropDown
                title={'التقارير'}
                id={'reports'}
                iconTitle={<HiDocumentReport style={{ margin: 'auto' }} />}
                options={reportsOptions}
              />
            </Nav.Item>

         
          </>
        }



        <button onClick={() => {
          localStorage.removeItem('type');
          localStorage.removeItem('email');
          localStorage.removeItem('user');
          navigate('/');
        }} className=' my-3 mx-auto w-100 btn btn-danger' style={{
        }}>
          <span> <MdLogout />  تسجيل الخروج  </span>
        </button>


      </div>

    </div>
  )
}




