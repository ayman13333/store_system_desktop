import React, { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap';
import CustumNumberInput from '../../Utilities/CustumNumberInput';
import ExpirationDateModal from './ExpirationDateModal';
import FormatDate from '../../Utilities/FormatDate';
import { FaTrashAlt } from "react-icons/fa";
import { CiEdit } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';



export default function AddItemComponent() {

    const location=useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState(
     ()=> location?.state?._id ? location?.state?.code  : ''
    );
    const [name, setName] = useState(
        ()=> location?.state?._id ? location?.state?.name  : ''
    );
    const [criticalValue, setCriticalValue] = useState(
        ()=> location?.state?._id ? location?.state?.criticalValue  : ''
    );
    const [unitPrice, setUnitPrice] = useState(
        ()=> location?.state?._id ? location?.state?.unitPrice  : ''
    );
    const [quantity, setQuantity] = useState(
        ()=> location?.state?._id ? location?.state?.totalQuantity  : ''
    );
    const [unit, setUnit] = useState(
        ()=> location?.state?._id ? location?.state?.unit  : ''
    );

    const [expirationDatesArr, setExpirationDatesArr] = useState([]);
    const [showExpirationDateModal, setShowExpirationDateModal] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);


    const deleteRow = (row) => {
        let filter = expirationDatesArr.filter(el => el?.key != row?.key);
        setExpirationDatesArr(filter);
        setRowToEdit(null);
    }

    const editRow = (row) => {
        setRowToEdit(row);
        setShowExpirationDateModal(true);
    }

    const addNewCategory = async () => {
        try {

            if (code == '') return toast.error('يجب ادخال الكود');
            if (name == '') return toast.error('يجب ادخال اسم الصنف');
            if (criticalValue == '' || criticalValue == '0') return toast.error('يجب ادخال الحد الحرج');
            if (quantity == '' || quantity == '0') return toast.error('يجب ادخال الكمية');
            if (unitPrice == '' || unitPrice == '0') return toast.error('يجب ادخال سعر الوحدة');
            if (unit == '') return toast.error('يجب ادخال الوحدة');
            if (expirationDatesArr.length == 0) return toast.error('يجب ادخال تاريخ صلاحية للصنف علي الاقل');


            // نقص 5 ايام من التواريخ
            let expirationDatesArrAfterSubDates = expirationDatesArr?.map(el => {
                // let date=new Date(el.date);
                let date = el?.date?.setDate(el?.date?.getDate() - 5);
                date = new Date(date);

                return {
                    ...el,
                    date
                }
            });

            console.log('expirationDatesArrAfterSubDates', expirationDatesArrAfterSubDates);

            // return;

            const data = {
                code,
                name,
                criticalValue,
                quantity,
                unit,
                unitPrice,
                expirationDatesArr
            };

            setIsLoading(true);
            const result = await window?.electron?.addCategory(data);
            setIsLoading(false);

            if (result.success == true) {
                toast.success('تم اضافة الصنف');
                setCode('');
                setName('');
                setCriticalValue('');
                setUnitPrice('');
                setQuantity('');
                setUnit('');
                setExpirationDatesArr([]);
            }
            else toast.error('فشل في عملية الاضافة');

        } catch (error) {

            console.log('error', error.message);
            toast.error('فشل في عملية الاضافة');
            setIsLoading(false);
        }

    }

    console.log('location.state',location.state);

    console.log('expirationDatesArr', expirationDatesArr);


    return (
        <div className='w-75 h-100'>
            <h1> {location?.state?._id ? 'تعديل صنف' :'اضافة صنف'}     {isLoading && <Spinner />} </h1>

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

            <div className="form-group my-3">

                <div className='d-flex justify-content-between'>
                    <h6 className="my-3">  تاريخ الصلاحية </h6>
                    <button
                        onClick={() => {
                            setRowToEdit(null);
                            setShowExpirationDateModal(true);

                        }}
                        className='btn btn-success h-50 my-auto'> اضافة تاريخ صلاحية </button>
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
                                expirationDatesArr?.map((el, i) =>
                                    <tr key={i}>
                                        <td>{FormatDate(el?.date)} </td>
                                        <td >{el?.quantity}</td>
                                        <td>
                                            <div className='d-flex h-25 gap-2'>
                                                <button onClick={() => deleteRow(el)} className='btn btn-danger h-25 my-auto'> <FaTrashAlt height={'5px'} /> </button>
                                                <button onClick={() => editRow(el)} className='btn btn-warning h-25 my-auto'> <CiEdit height={'5px'} /> </button>

                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>
                </div>

                {
                    showExpirationDateModal && <ExpirationDateModal
                        show={showExpirationDateModal} setShow={setShowExpirationDateModal}
                        expirationDatesArr={expirationDatesArr}
                        setExpirationDatesArr={setExpirationDatesArr}
                        rowToEdit={rowToEdit}
                        setRowToEdit={setRowToEdit}
                    />

                }


            </div>


            <div>
                {
                    location?.state?._id  ?
                    <button
                   // onClick={() => addNewCategory()}
                    disabled={isLoading}
                    className='btn btn-warning h-50 my-auto'> تعديل  صنف </button>
                    :
                    <button
                    onClick={() => addNewCategory()}
                    disabled={isLoading}
                    className='btn btn-success h-50 my-auto'> اضافة  صنف </button>
                }
                
            </div>

            {isLoading && <Spinner />}

        </div>
    )
}
