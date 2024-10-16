import React, { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap';
import CustumNumberInput from '../../Utilities/CustumNumberInput';
import ExpirationDateModal from './ExpirationDateModal';
import FormatDate from '../../Utilities/FormatDate';
import { FaTrashAlt } from "react-icons/fa";


export default function AddItemComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [criticalValue, setCriticalValue] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    const[expirationDatesArr,setExpirationDatesArr]=useState([]);
    const[showExpirationDateModal,setShowExpirationDateModal]=useState(false);


    const deleteRow=(row)=>{
            let filter=expirationDatesArr.filter(el=>el?.key!=row?.key);
            setExpirationDatesArr(filter);
    }


    console.log('expirationDatesArr',expirationDatesArr);


    return (
        <div className='w-75 h-100'>
            <h1>  اضافة صنف   {isLoading && <Spinner />} </h1>

            <div className="form-group">
                <label className="my-2"> الكود </label>
                <input
                    value={code} onChange={(e) => setCode(e.target.value)}
                    required
                    type="text" className="form-control" placeholder=" الكود"
                />
            </div>

            <div className="form-group">
                <label className="my-2"> الاسم </label>
                <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    required
                    type="text" className="form-control" placeholder=" الاسم"
                />
            </div>

            <div className="form-group">
                <label className="my-2"> الحد الحرج </label>
                <CustumNumberInput
                    value={criticalValue} setValue={setCriticalValue}
                    placeholder={'الحد الحرج'}
                    required={true}
                />
            </div>

            <div className="form-group">
                <label className="my-2"> سعر الوحدة </label>
                <CustumNumberInput
                    value={unitPrice} setValue={setUnitPrice}
                    placeholder={'سعر الوحدة'}
                    required={true}
                />
            </div>

            <div className="form-group">
                <label className="my-2"> الكمية </label>

                <CustumNumberInput
                    value={quantity} setValue={setQuantity}
                    placeholder={'الكمية'}
                    required={true}
                />
            </div>

            <div className="form-group">
                <label className="my-2">  الوحدة </label>
                <input
                    value={unit} onChange={(e) => setUnit(e.target.value)}
                    required
                    type="text" className="form-control" placeholder="الوحدة"
                />
            </div>

            <div className="form-group">

                <div className='d-flex justify-content-between'>
                    <h6 className="my-3">  تاريخ الصلاحية </h6>
                    <button 
                    onClick={()=>setShowExpirationDateModal(true)}
                    className='btn btn-success h-50 my-auto'> اضافة </button>
                </div>



                <div className='d-flex justify-content-between'>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th scope="col">تاريخ الصلاحية</th>
                                <th scope="col">الكمية</th>
                                <th scope="col">تحكم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                expirationDatesArr?.map((el,i)=>
                                <tr key={i}>
                                    <td>{ FormatDate(el?.date)} </td>
                                    <td >{el?.quantity}</td>
                                    <td>
                                        <div className='d-flex h-25'>
                                            <button onClick={()=>deleteRow(el)} className='btn btn-danger h-25 my-auto'> <FaTrashAlt height={'5px'} /> </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            }
                            {/* <tr>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr> */}
                            {/* <tr>
                                <td>Jacob</td>
                                <td>Thornton</td>
                            </tr>
                            <tr>
                                <td>Larry</td>
                                <td>the Bird</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>

                {
                    showExpirationDateModal&&<ExpirationDateModal 
                    show={showExpirationDateModal} setShow={setShowExpirationDateModal} 
                    expirationDatesArr={expirationDatesArr}
                    setExpirationDatesArr={setExpirationDatesArr}
                    />   
               
                }


            </div>



        </div>
    )
}
