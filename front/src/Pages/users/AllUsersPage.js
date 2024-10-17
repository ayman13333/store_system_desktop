import React, { useEffect } from 'react'
import SideBar from '../../Utilities/SideBar'
import AllUsersComponent from '../../components/users/AllUsersComponent'

export default function AllUsersPage() {
  useEffect(()=>{
    const handleWheel = (event) => {
      // event.preventDefault();
      // Optionally blur the input to remove focus and further prevent interaction
      event.currentTarget.blur();
    };

   // let inputsElements=document.getElementsByTagName('input');

    const numberInputs = document.querySelectorAll('input[type="number"]');

    console.log('numberInputs',numberInputs);

  

    numberInputs.forEach(input => {
      input.addEventListener('wheel', handleWheel);
    });

  },[]);

  return (
    <div className='parent'>
    <SideBar />
    <div className="p-4 w-100">
    <AllUsersComponent />
    </div>    
</div>
  )
}
