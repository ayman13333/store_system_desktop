//import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdBedroomParent, MdLogout, MdModeEdit } from "react-icons/md";
import { BsBackpack4Fill, BsFillFilePersonFill, BsFillPersonVcardFill, BsGlobeCentralSouthAsia } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa";
import { Accordion, Dropdown, DropdownButton, Nav } from 'react-bootstrap';

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
              سجل الموردين
            </div>
          </span>
        </NavLink>

        {/* <Nav.Item>
          <button className='link my-3 w-100 navButton' style={{border:'none',background:'none'}}>
            الفواتير
          </button>
        </Nav.Item>
                     <FaFileInvoice /> 

        */}
        <Nav.Item>
          <select 
          onChange={(e)=>{
            if(e.target.value=='0') return;
            navigate(e.target.value);
          }}
          style={{background:'#212529',color:'white',border:'none',width:'100%'}}>
            <option value={'0'}> 
              الفواتير
            </option>
            <option value={'/supplyInvoice'}>
            فاتورة توريد
            </option>
          </select>
        </Nav.Item>

      

        {/* <Dropdown>
          <Dropdown.Toggle variant="black" id="dropdown-basic">
            الفواتير
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
            <NavLink className='link2' style={{color:'black'}} to={'/supplyInvoice'}>
            فاتورة توريد
            </NavLink>
      
             </Dropdown.Item>
            <Dropdown.Item href="#/action-2">Option 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Option 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}




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




