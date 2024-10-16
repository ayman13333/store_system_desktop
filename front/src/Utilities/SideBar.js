//import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdBedroomParent, MdLogout, MdModeEdit } from "react-icons/md";
import { BsArrowLeftRight, BsBackpack4Fill, BsCalendar2DateFill, BsClipboardCheckFill, BsFillFilePersonFill, BsFillPersonVcardFill, BsGlobeCentralSouthAsia } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  //  console.log('lllll', localStorage.getItem('type'));

  const type = localStorage.getItem('type');

  return (
    <div style={{ width: '20%', backgroundColor: '#212529', color: 'white' }}>
      <div className='p-2 sidebar'>
        <h4 className='my-3 text-center'> لوحة التحكم </h4>

        <p className='text-right my-3'>   <BsFillFilePersonFill />  {localStorage.getItem('email')} </p>
     
        
        <NavLink className='link my-2' to={'/allitems'}>
          <span> <BsBackpack4Fill />  ادارة الاصناف  </span>
        </NavLink> 
       



        <button onClick={() => {
          localStorage.removeItem('type');
          localStorage.removeItem('email');
          navigate('/');
        }} className=' my-2 mx-auto w-100 btn btn-danger' style={{
        }}>
          <span> <MdLogout />  تسجيل الخروج  </span>
        </button>


      </div>

    </div>
  )
}




