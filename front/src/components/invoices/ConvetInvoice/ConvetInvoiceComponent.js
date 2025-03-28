import React, { useContext, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import ExpirationDatesModal from '../supplyInvoice/ExpirationDatesModal';
import AddQuantityModal from '../supplyInvoice/AddQuantityModal';
import { CiEdit } from 'react-icons/ci';
import FormatDate from '../../../Utilities/FormatDate';
import CustumNumberInput from '../../../Utilities/CustumNumberInput';
import { toast } from 'react-toastify';
import Select from 'react-select';
import CalculateSum from '../../../Utilities/CalculateSum';
import FormatDateForHTML from '../../../Utilities/FormatDateForHTML';
import { MyContext } from '../../..';


export default function ConvetInvoiceComponent({ type = null, invoice = null }) {

      const { setEntities } = useContext(MyContext);
    
    const [isLoading, setIsLoading] = useState(false);
    // رقم  الفاتورة
    const [invoiceNumber, setInvoiceNumber] = useState(() => type == null ? '' : invoice?.serialNumber);
    // جهات الصرف
    const [suppliers, setSuppliers] = useState([]);
    // اسم جهة الصرف
    const [selectedSupplier, setSelectedSupplier] = useState(() => type == null ? '0' : invoice?.supplierID?._id);
    // تاريخ الصرف
    const [supplyDate, setSupplyDate] = useState(() => type == null ? '' : new Date(invoice?.supplyDate));

    // كود الفاتورة
    const [invoiceCode, setInvoiceCode] = useState(() => type == null ? '' : invoice?.invoiceCode);
    // State to store the selected option
    const [selectedOptionArr, setSelectedOptionArr] = useState(() => type == null ? null : invoice?.invoicesData);
    // تواريخ الصلاحية
    const [showExpirationDatesModal, setShowExpirationDatesModal] = useState(false);
    const [categoryToShow, setCategoryToShow] = useState(null);
    // اضافة كمية
    const [showAddQuantityModalBefore, setShowAddQuantityModalBefore] = useState(false);

    const [showAddQuantityModalAfter, setShowAddQuantityModalAfter] = useState(false);


    const [notes, setNotes] = useState(() => type == null ? '' : invoice?.notes);

    // المراد تحويلها الاصناف
    const [categoriesToConvert, setCategoriesToConvert] = useState([]);

    // بعد تحويلها الاصناف
    const [categoriesAfterConvert, setCategoriesAfterConvert] = useState([]);
    const [selectedOptionArr2, setSelectedOptionArr2] = useState(() => type == null ? null : invoice?.invoicesData2);



    const loggedUser = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        const get = async () => {
            setIsLoading(true);
            const [result, categories] = await Promise.all([
                window?.electron?.getAllUsers({ type: 'transfer' }),
                window?.electron?.getAllCategories()
            ]);

            // console.log('categories', categories);
            setIsLoading(false);
            // console.log('result',result);

            let activeAsuuplires = result?.users?.filter(el => el?.status == true);

            setSuppliers(activeAsuuplires);

            if(type!=null) setEntities(activeAsuuplires);


            let categoriesForSelect = categories?.categories?.map(el => {
                return {
                    ...el,
                    label: el?.name,
                    value: el?._id,
                    totalQuantity: 0,
                    originalQuantity: el?.totalQuantity,
                    unitPrice: parseFloat(el.unitPrice.toFixed(2)),
                    expirationDatesArr: [],
                    originalExpirationDatesArr: el?.expirationDatesArr
                }
            })
            setCategoriesToConvert(categoriesForSelect);

            setCategoriesAfterConvert(categoriesForSelect);
        }

        get();
    }, []);

    useEffect(()=>{
            if(type!=null){
                setInvoiceNumber(() => type == null ? '' : invoice?.serialNumber);    
                // اسم جهة الصرف
                 setSelectedSupplier(() => type == null ? '0' : invoice?.supplierID?._id);
                // تاريخ الصرف
               setSupplyDate(() => type == null ? '' : new Date(invoice?.supplyDate));
               
                // كود الفاتورة
                 setInvoiceCode(() => type == null ? '' : invoice?.invoiceCode);
                // State to store the selected option
                setSelectedOptionArr(() => type == null ? null : invoice?.invoicesData);
                // تواريخ الصلاحية
                 setNotes(() => type == null ? '' : invoice?.notes);
                 
                 setSelectedOptionArr2(() => type == null ? null : invoice?.invoicesData2);
            }
        },[invoice]);

    const toDayDate = FormatDate(new Date);

    // console.log('categoriesToConvert', categoriesToConvert);
    console.log('selectedOptionArr', selectedOptionArr);


    const handleChange2 = (option) => {
        setSelectedOptionArr2(option);
    };


    // Handle change event
    const handleChange = (option) => {
        setSelectedOptionArr(option);
    };

    // تواريخ الصلاحية
    const showSelectedCategory = (el) => {
        setCategoryToShow(el);
        setShowExpirationDatesModal(true);
    }

    // اضافة كمية وسعر before
    const showQuantity = (el) => {
        setCategoryToShow(el);
        setShowAddQuantityModalBefore(true);
    }

    // after
    const showQuantityAfter = (el) => {
        setCategoryToShow(el);
        setShowAddQuantityModalAfter(true);
    }

    const addNewInvoice = async () => {
        try {
            // if (invoiceCode == '') return toast.error('من فضلك ادخل كود الفاتورة');
            if (invoiceNumber == '') return toast.error('من فضلك ادخل رقم الفاتورة');
            if (selectedSupplier == '0') return toast.error('من فضلك ادخل جهة الصرف');
            if (supplyDate == '') return toast.error('من فضلك ادخل تاريخ التحويل');



            if (selectedOptionArr == null || selectedOptionArr.length == 0) return toast.error(" من فضلك اختر قائمة الاصناف المراد تحويلها");

            if (selectedOptionArr2 == null || selectedOptionArr2.length == 0) return toast.error(" من فضلك اختر قائمة الاصناف بعد تحويلها");


            let totalQuantityBefore = 0;
            let totalQuantityAfter = 0;

            let unitPriceBefore = 0;
            let unitPriceAfter = 0;

            let hasError1 = false;
            selectedOptionArr?.map(el => {
                if (el?.totalQuantity == '0') {
                    hasError1 = true;
                    // 
                }

                totalQuantityBefore += el?.totalQuantity;
                unitPriceBefore += el?.unitPrice;
            });

            if (hasError1 == true) return toast.error('  من فضلك تاكد من  وجود كميه بكل صنف في الاصناف المراد تحويلها');

            let hasError2 = false;
            selectedOptionArr2?.map(el => {
                if (el?.totalQuantity == '0') {
                    hasError2 = true;
                    return toast.error('  من فضلك تاكد من  وجود كميه بكل صنف في الاصناف بعد تحويلها');
                }

                totalQuantityAfter += el?.totalQuantity;
                unitPriceAfter += el?.unitPrice;
            });

            if (hasError2 == true) return toast.error('  من فضلك تاكد من  وجود كميه بكل صنف في الاصناف المراد تحويلها');


            console.log('totalQuantityBefore', totalQuantityBefore);
            console.log('totalQuantityAfter', totalQuantityAfter);

            if (totalQuantityBefore != totalQuantityAfter) {
                return toast.error('يجب ان تكون كمية الاصناف قبل وبعد التحويل متساوية');

            }

            if (unitPriceAfter != unitPriceBefore) {
                return toast.error('يجب ان يكون مجموع اسعار الاصناف قبل وبعد التحويل متساوية');
            }

            // console.log('done');
            // return;


            const data = {
                type: 'convert',
                selectedOptionArr,
                invoiceCode,
                supplierID: selectedSupplier,
                employeeID: loggedUser?._id,
                notes,
                registerDate: new Date().toString(),
                supplyDate: new Date(supplyDate)?.toString(),
                total_payment_price: CalculateSum({ selectedOptionArr }),
                total_suplly_price: CalculateSum({ selectedOptionArr: selectedOptionArr2 }),
                invoiceNumber,
                selectedOptionArr2
            };

            setIsLoading(true);
            const result = await window?.electron?.changeInvoice(data);
            setIsLoading(false);

            console.log('data', data);
            // changeInvoice

            if (result.success == true) {
                toast.success('تم اضافة الفاتورة بنجاح');
                setInvoiceNumber('');
                setSelectedSupplier('0');
                setSupplyDate('');
                setInvoiceCode('');
                setNotes('');
                setSelectedOptionArr(null);
                setSelectedOptionArr2(null);
            }
            else {
                toast.error('فشل في عملية الاضافة');
                console.log('mmmmmmmmmmmmm');
            }

        } catch (error) {
            console.log('error', error);
            setIsLoading(false);
            toast.error('فشل في عملية الاضافة');
        }
    }

    console.log('selectedOptionArr2', selectedOptionArr2);

    return (
        <div className={`${type == null ? 'w-75 h-100' : ''}`} style={{
            // overflowX:'hidden'
        }}>
            {type == null && <h1 style={{ background: "#b9d5fd", padding: "10px", border: "2px solid #c1c1c1", width: "265px" }}>  فاتورة التحويل   {isLoading && <Spinner />} </h1>}

            <div className="form-group">
                <label className="my-2"> نوع الفاتورة </label>
                <input
                    value={'تحويل'}
                    disabled
                    type="text" className="form-control"
                />
            </div>
            {
                type != null && <div className="form-group">
                    <label className="my-2"> كود الفاتورة </label>
                    <input
                        value={invoiceCode}
                        onChange={(e) => setInvoiceCode(e.target.value)}
                        type="text" className="form-control"
                        placeholder="كود الفاتورة"
                        disabled={type ? true : false}
                    />
                </div>
            }


            <div className="form-group">
                <label className="my-2"> رقم  الفاتورة </label>
                <CustumNumberInput
                    value={invoiceNumber} setValue={setInvoiceNumber}
                    placeholder={'رقم  الفاتورة'}
                    required={true}
                    disabled={type ? true : false}
                />
            </div>

            <div className="form-group">
                <label className="my-2"> اسم جهة التحويل </label>
                <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="form-control"
                    disabled={type ? true : false}
                >
                    {type == null && <option value={'0'}> من فضلك اختر جهة التحويل </option>}
                    {
                        suppliers?.length > 0 && suppliers?.map((el, i) => <option key={i} value={el?._id}>{el?.fullName}</option>)
                    }
                </select>
            </div>

            <div className="form-group">
                <label className="my-2">  تاريخ التحويل </label>
                <input
                    value={
                        type ? FormatDateForHTML(supplyDate) : supplyDate
                    }
                    onChange={(e) => setSupplyDate(e.target.value)}
                    required
                    type={type == null ? "date" : "text"} className="form-control"
                    disabled={type ? true : false}
                />
            </div>

            <div className="form-group">
                <label className="my-2">  تاريخ التسجيل </label>
                <input
                    value={
                        type ? FormatDate(new Date(invoice?.registerDate)) : FormatDate(new Date)
                    }
                    disabled
                    type="text" className="form-control" />
            </div>

            <div className="form-group">
                <label className="my-2">   اسم الموظف </label>
                <input
                    value={type ? invoice?.employeeID?.email : loggedUser?.email}
                    disabled
                    type="text" className="form-control" />
            </div>

            <div className='form-group'>
                <label className="my-2"> ملاحظات </label>
                <textarea
                    value={type ? invoice?.notes : notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-control"
                    style={{ height: '100px' }}
                    disabled={type ? true : false}
                >

                </textarea>
            </div>


            {
                categoriesToConvert && <div className="form-group my-2">
                    <div className='d-flex justify-content-between my-4'>
                        <div>
                            <label className="my-2">  قائمة الاصناف المراد تحويلها </label>
                        </div>

                        <div className="total">
                            <label className="my-2">
                                {`اجمالي الاصناف المراد تحويلها : ${CalculateSum({ selectedOptionArr })} جنيه`}

                            </label>
                        </div>

                    </div>
                    <Select
                        isMulti={true}
                        value={selectedOptionArr}
                        onChange={handleChange}
                        options={categoriesToConvert}
                        isDisabled={type ? true : false}
                    />
                </div>
            }

            {
                <div className='d-flex justify-content-between' style={{
                    overflow: 'auto',
                    width: '100%'
                }}>
                    <table className="table mt-3" style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}>
                        <thead>
                            <tr>
                                <th className="text-center" scope="col"> الاسم </th>
                                <th className="text-center" scope="col">الكود  </th>
                                {
                                    type == null && <th className="text-center" scope="col" style={{
                                        whiteSpace: "nowrap"
                                    }}> تاريخ انتهاء الصلاحية </th>
                                }

                                <th className="text-center" scope="col"> سعر </th>
                                <th className="text-center" scope="col"> كمية </th>
                                <th className="text-center" scope="col"> وحدة </th>
                                <th className="text-center" scope="col"> الاجمالي </th>
                                {type == null && <th className="text-center mx-auto" scope="col">تحكم</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedOptionArr?.map((el, i) =>
                                    <tr key={i}>
                                        <td className="text-center p-13">  {el?.name}   </td>
                                        <td className="text-center p-13" >{el?.code}</td>
                                        {
                                            type == null && <td className="text-center" >
                                                <button onClick={() => showSelectedCategory(el)} className="btn btn-success small">
                                                    اضغط هنا
                                                </button>
                                            </td>
                                        }

                                        <td className="text-center p-13" >{el?.unitPrice}</td>
                                        <td className="text-center p-13" >{el?.totalQuantity}</td>
                                        <td className="text-center p-13" >{el?.unit}</td>
                                        <td className="text-center p-13">{parseFloat(Number(el?.unitPrice * el?.totalQuantity).toFixed(2))} </td>
                                        {
                                            type == null && <td className="text-center">
                                                <div className='d-flex h-25 gap-2'>
                                                    <button
                                                        onClick={() => showQuantity(el)}
                                                        className='btn btn-warning h-25 my-auto mx-auto small'
                                                    > <CiEdit height={'5px'} /> </button>

                                                </div>
                                            </td>
                                        }
                                    </tr>
                                )
                            }

                            {
                                showExpirationDatesModal && <ExpirationDatesModal
                                    show={showExpirationDatesModal} setShow={setShowExpirationDatesModal}
                                    category={categoryToShow} setCategory={setCategoryToShow}
                                    type={'pill'}
                                />
                            }

                            {
                                showAddQuantityModalBefore && <AddQuantityModal
                                    show={showAddQuantityModalBefore} setShow={setShowAddQuantityModalBefore}
                                    category={categoryToShow} setCategory={setCategoryToShow}
                                    categories={categoriesToConvert} setCategories={setCategoriesToConvert}
                                    setSelectedOptionArr={setSelectedOptionArr}
                                    type={'payment'}
                                />
                            }

                        </tbody>
                    </table>
                </div>
            }

            {/* بعد التحويل */}
            {
                categoriesAfterConvert && <div className="form-group my-2">
                    <div className='d-flex justify-content-between my-4'>
                        <div>
                            <label className="my-2">  قائمة الاصناف بعد تحويلها </label>
                        </div>

                        <div className="total">
                            <label className="my-2">
                                {`اجمالي الاصناف بعد تحويلها : ${CalculateSum({ selectedOptionArr: selectedOptionArr2 })} جنيه`}

                            </label>
                        </div>

                    </div>
                    <Select
                        isMulti={true}
                        value={selectedOptionArr2}
                        onChange={handleChange2}
                        options={categoriesAfterConvert}
                        isDisabled={type ? true : false}
                    />
                </div>
            }

            {
                <div className='d-flex justify-content-between' style={{
                    overflow: 'auto',
                    width: '100%'
                }}>
                    <table className="table mt-3" style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}>
                        <thead>
                            <tr>
                                <th className="text-center" scope="col"> الاسم </th>
                                <th className="text-center" scope="col">الكود  </th>
                                {/* {
                                    type == null && <th className="text-center" scope="col" style={{
                                        whiteSpace: "nowrap"
                                    }}> تاريخ انتهاء الصلاحية </th>
                                } */}

                                <th className="text-center" scope="col"> سعر </th>
                                <th className="text-center" scope="col"> كمية </th>
                                <th className="text-center" scope="col"> وحدة </th>
                                <th className="text-center" scope="col"> الاجمالي </th>
                                {type == null && <th className="text-center mx-auto" scope="col">تحكم</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedOptionArr2?.map((el, i) =>
                                    <tr key={i}>
                                        <td className="text-center p-13">  {el?.name}   </td>
                                        <td className="text-center p-13" >{el?.code}</td>
                                        {/* {
                                            type == null && <td className="text-center" >
                                                <button onClick={() => showSelectedCategory(el)} className="btn btn-success small">
                                                    اضغط هنا
                                                </button>
                                            </td>
                                        } */}

                                        <td className="text-center p-13" >{el?.unitPrice}</td>
                                        <td className="text-center p-13" >{el?.totalQuantity}</td>
                                        <td className="text-center p-13" >{el?.unit}</td>
                                        <td className="text-center p-13">{parseFloat(Number(el?.unitPrice * el?.totalQuantity).toFixed(2))} </td>
                                        {
                                            type == null && <td className="text-center">
                                                <div className='d-flex h-25 gap-2'>
                                                    {/* <button  className='btn btn-danger h-25 my-auto'> <FaTrashAlt height={'5px'} /> </button> */}
                                                    <button
                                                        onClick={() => showQuantityAfter(el)}
                                                        className='btn btn-warning h-25 my-auto mx-auto small'
                                                    > <CiEdit height={'5px'} /> </button>

                                                </div>
                                            </td>
                                        }

                                    </tr>
                                )
                            }

                            {/* {
                                showExpirationDatesModal && <ExpirationDatesModal
                                    show={showExpirationDatesModal} setShow={setShowExpirationDatesModal}
                                    category={categoryToShow} setCategory={setCategoryToShow}
                                // setSelectedOptionArr={setSelectedOptionArr}
                                // type={'payment'}

                                />
                            } */}

                            {
                                showAddQuantityModalAfter && <AddQuantityModal
                                    show={showAddQuantityModalAfter} setShow={setShowAddQuantityModalAfter}
                                    category={categoryToShow} setCategory={setCategoryToShow}
                                    categories={categoriesAfterConvert} setCategories={setCategoriesAfterConvert}
                                    setSelectedOptionArr={setSelectedOptionArr2}
                                    type={'supply'}
                                />
                            }

                        </tbody>
                    </table>
                </div>
            }

            <div className='d-flex justify-content-between'>

                {
                    type == null && <button
                        onClick={() => addNewInvoice()}
                        disabled={isLoading}
                        className='btn btn-success  my-auto'> اضافة  فاتورة </button>
                }


                {/* <button
                onClick={() => window.history.back()}
                className='btn btn-primary h-50 my-auto'> رجوع </button> */}

            </div>

            {isLoading && <Spinner />}

        </div>
    )
}
