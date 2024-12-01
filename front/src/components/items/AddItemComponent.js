import React, { useState } from 'react'
import {  Spinner } from 'react-bootstrap';
import CustumNumberInput from '../../Utilities/CustumNumberInput';
import ExpirationDateModal from './ExpirationDateModal';
import FormatDate from '../../Utilities/FormatDate';
import { FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmEditModal from './ConfirmEditModal';



export default function AddItemComponent() {

    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState(
        () => location?.state?._id ? location?.state?.code : ''
    );
    const [name, setName] = useState(
        () => location?.state?._id ? location?.state?.name : ''
    );
    const [criticalValue, setCriticalValue] = useState(
        () => location?.state?._id ? location?.state?.criticalValue : ''
    );
    const [unitPrice, setUnitPrice] = useState(
        () => location?.state?._id ? location?.state?.unitPrice : ''
    );
    const [quantity, setQuantity] = useState(
        () => location?.state?._id ? location?.state?.totalQuantity : ''
    );
    const [unit, setUnit] = useState(
        () => location?.state?._id ? location?.state?.unit : ''
    );

    const [expirationDatesArr, setExpirationDatesArr] = useState(
        () => {
            if (location?.state?._id) {
                let expirationDatesWithKey = location?.state?.expirationDatesArr?.map((el, i) => {
                    return {
                        ...el,
                        key: i
                    }
                });

                return expirationDatesWithKey;
            }
            else {
                return [];
            }
        }

        //  () => location?.state?._id ? location?.state?.expirationDatesArr : []
    );
    const [showExpirationDateModal, setShowExpirationDateModal] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);

    const [editDate, setEditDate] = useState(
        () => location?.state?.editDate ? new Date(location?.state?.editDate) : new Date()
    );

    const [user, setUser] = useState(
        () => location?.state?.user?._id ? location?.state?.user : JSON.parse(localStorage.getItem('user'))
    );

    const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);




    const deleteRow = (row) => {
        let filter = expirationDatesArr.filter(el => {
            if (el?.key != row?.key) return el;
            else {
                setQuantity(prev => Number(Number(prev) - Number(el?.quantity)));
            }
        });

        // setQuantity(prev=>Number(Number(prev)+Number(newQuantity)));
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
            // if (quantity == '' || quantity == '0') return toast.error('يجب ادخال الكمية');
            if (unitPrice == '' || unitPrice == '0') return toast.error('يجب ادخال سعر الوحدة');
            if (unit == '') return toast.error('يجب ادخال الوحدة');
            if (expirationDatesArr.length == 0) return toast.error('يجب ادخال تاريخ صلاحية للصنف علي الاقل');


            let expirationDatesArrWithOutSub = expirationDatesArr;
            // نقص 5 ايام من التواريخ
            const expirationDatesArrAfterSubDates = expirationDatesArr?.map(el => {
                // let date=new Date(el.date);
                // let date = el?.date?.setDate(el?.date?.getDate() - 5);
                // date = new Date(date);

                const date = new Date(el.date);

                // Subtract 5 days from the new date instance
                date.setDate(date.getDate() - 5);

                return {
                    ...el,
                    date
                }
            });

            console.log('expirationDatesArrAfterSubDates', expirationDatesArrAfterSubDates);
            console.log('expirationDatesArr', expirationDatesArr);

            // return;

            const data = {
                code,
                name,
                criticalValue,
                quantity,
                unit,
                unitPrice,
                expirationDatesArr: expirationDatesArrAfterSubDates
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
            else {
                toast.error('فشل في عملية الاضافة');
                console.log('mmmmmmmmmmmmm');
                // console.log('expirationDatesArrprev');

                //    setExpirationDatesArr(prev=>{
                //     console.log('prev',prev);
                //    });
                //  setIsLoading(false);
            }

        } catch (error) {

            console.log('error', error.message);
            toast.error('فشل في عملية الاضافة');
            // setExpirationDatesArr(expirationDatesArrWithOutSub);
            setIsLoading(false);
        }

    }

    const editCategory = async () => {
        try {
            if (code == '') return toast.error('يجب ادخال الكود');
            if (name == '') return toast.error('يجب ادخال اسم الصنف');
            if (criticalValue == '' || criticalValue == '0') return toast.error('يجب ادخال الحد الحرج');
            // if (quantity == '' || quantity == '0') return toast.error('يجب ادخال الكمية');
            if (unitPrice == '' || unitPrice == '0') return toast.error('يجب ادخال سعر الوحدة');
            if (unit == '') return toast.error('يجب ادخال الوحدة');
            if (expirationDatesArr.length == 0) return toast.error('يجب ادخال تاريخ صلاحية للصنف علي الاقل');


            // نقص 5 ايام من التواريخ
            let expirationDatesArrAfterSubDates = expirationDatesArr?.map(el => {
                // let date=new Date(el.date);
                // صنف موجود قبل كدة مش هنقص منه تاني
                if (el?._id) return el;

                let date = el?.date?.setDate(el?.date?.getDate() - 5);
                date = new Date(date);

                return {
                    ...el,
                    date
                }
            });

            

            console.log('expirationDatesArrAfterSubDates', expirationDatesArrAfterSubDates);

            //  return;

            const data = {
                _id:location?.state?._id,
                code,
                name,
                criticalValue,
                quantity,
                unit,
                unitPrice,
                expirationDatesArr,
                lastCode: location?.state?.code,
                user: user?._id,
                editDate:new Date()

            };

            setIsLoading(true);
            const result = await window?.electron?.editCategory(data);
            setIsLoading(false);

            console.log('result', result);

            if (result.success == true) {
                toast.success('تم تعديل الصنف');
                navigate('/allitems');
                // setCode('');
                // setName('');
                // setCriticalValue('');
                // setUnitPrice('');
                // setQuantity('');
                // setUnit('');
                // setExpirationDatesArr([]);

            }
            else toast.error('فشل في عملية التعديل');
        } catch (error) {
            console.log('error', error.message);
            toast.error('فشل في عملية التعديل');
            setExpirationDatesArr(prev => prev);
            setIsLoading(false);
        }
    }

    // console.log('location.state', location.state);

    console.log('expirationDatesArr', expirationDatesArr);


    return (
        <div className='w-75 h-100'>
            <div className="d-flex justify-content-between">
            <h1> {location?.state?._id ? 'تعديل صنف' : 'اضافة صنف'}     {isLoading && <Spinner />} </h1>

                <div>
                <button
                    onClick={() => window.history.back()}
                    className='btn btn-primary  my-auto'> رجوع </button>
                </div>
            </div>

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
                    type={'float'}
                />
            </div>

            <div className="form-group">
                <label className="my-2"> الكمية </label>

                <CustumNumberInput
                    value={quantity}
                    setValue={setQuantity}
                    placeholder={'الكمية'}
                    disabled={true}
                    required={true}
                    type={'float'}
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

            {
                location?.state?.editDate && <>
                    <div className="form-group">
                        <label className="my-2">  تاريخ التعديل </label>
                        <input
                            value={FormatDate(editDate)}
                            disabled
                            type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label className="my-2">   اسم الموظف </label>
                        <input
                            value={user?.email}
                            disabled
                            type="text" className="form-control" />
                    </div>

                </>
            }

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
                                        <td className="p-13">{FormatDate(new Date(el?.date))} </td>
                                        <td className="p-13" >{el?.quantity}</td>
                                        <td>
                                            <div className='d-flex h-25 gap-2'>
                                                <button onClick={() => deleteRow(el)} className='btn btn-danger h-25 my-auto small'> <FaTrashAlt height={'5px'} /> </button>
                                                {/* <button onClick={() => editRow(el)} className='btn btn-warning h-25 my-auto'> <CiEdit height={'5px'} /> </button> */}
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
                        setQuantity={setQuantity}
                    />

                }


            </div>

            {
                showConfirmEditModal && <ConfirmEditModal
                    show={showConfirmEditModal} setShow={setShowConfirmEditModal}
                    func={editCategory}
                />
            }


            <div className='d-flex justify-content-between'>
                {
                    location?.state?._id ?
                        <button
                            onClick={() => {
                                setShowConfirmEditModal(true);
                                // editCategory()
                            }}
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
