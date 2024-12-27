import React from 'react'
import { FaChevronCircleDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CustomDropDown({ title, id, iconTitle, options }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                document.getElementById(id).style.display = document.getElementById(id).style.display == 'none' ? 'block' : 'none';
            }}
            style={{ background: 'rgb(74 166 255)', color: 'white', border: 'none', width: '100%',cursor:'pointer' }}>
            <div className='link d-flex justify-content-between my-3' value={'0'}>
                <span className='d-flex' style={{ gap: '10px' }}>
                    {iconTitle}
                    {title}
                </span>

                <span className='my-auto'> <FaChevronCircleDown /> </span>
            </div>
            <div id={id} style={{ display: 'none',cursor:'pointer' }}>
                {
                    options?.map((el, i) =>
                        <div key={i}
                            className='link mx-4 p-1'
                            onClick={() =>{
                                navigate(el?.to);
                            }}
                        >
                            {el?.value}
                        </div>
                    )
                }


            </div>

        </div>
    )
}
