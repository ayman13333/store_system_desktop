import { useEffect } from "react";
import AllGuestsComponent from "../../components/users/AllGuestsComponent";
import SideBar from "../../Utilities/SideBar";

export default function GuestsPage() {

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
                <AllGuestsComponent />
            </div>
        </div>
    )
}
