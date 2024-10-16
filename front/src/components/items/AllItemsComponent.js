import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function AllItemsComponent() {

    const navigate=useNavigate();

    const[isLoading,setIsLoading]=useState(false);

  return (
    <div className='w-100 h-100'>
    <h1> ادارة الاصناف   {isLoading&&<Spinner />} </h1>

    <button className='btn btn-success' onClick={() => {
               navigate('/allitems/add');
            }} > اضافة <BsPlus /> </button>

        
    </div>
  )
}
