import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import CustumNumberInput from "../../../Utilities/CustumNumberInput";
import FormatDate from "../../../Utilities/FormatDate";
import Select from 'react-select';
import { FaTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import ExpirationDatesModal from "./ExpirationDatesModal";
import AddQuantityModal from "./AddQuantityModal";

export default function SupplyInvoiceComponent() {
    const [isLoading, setIsLoading] = useState(false);
    // رقم  الفاتورة
    const [invoiceNumber, setInvoiceNumber] = useState('');
    // جهات التوريد
    const [suppliers, setSuppliers] = useState([]);
    // اسم جهة التوريد
    const [selectedSupplier, setSelectedSupplier] = useState('0');
    // تاريخ التوريد
    const [supplyDate, setSupplyDate] = useState('');
    // الاصناف
    const [categories, setCategories] = useState([]);
    // كود الفاتورة
    const[invoiceCode,setInvoiceCode]=useState('');
     // State to store the selected option
    const [selectedOptionArr, setSelectedOptionArr] = useState(null);
    // تواريخ الصلاحية
    const[showExpirationDatesModal,setShowExpirationDatesModal]=useState(false);
    const[categoryToShow,setCategoryToShow]=useState(null);
    // اضافة كمية
    const[showAddQuantityModal,setShowAddQuantityModal]=useState(false);

    useEffect(() => {
        const get = async () => {
            setIsLoading(true);
            const [result, categories] = await Promise.all([
                window?.electron?.getAllUsers({ type: 'supplier' }),
                window?.electron?.getAllCategories()
            ]);

           // console.log('categories', categories);
            setIsLoading(false);
            // console.log('result',result);

            setSuppliers(result?.users);

            let categoriesForSelect=categories?.categories?.map(el=>{
                return{
                    ...el,
                    label:el?.name,
                    value:el?._id
                }
            })
            setCategories(categoriesForSelect);
        }

        get();
    }, []);

    const toDayDate = FormatDate(new Date);

    console.log('categories', categories);
    console.log('selectedOptionArr',selectedOptionArr);

   

   

    // Handle change event
    const handleChange = (option) => {
        setSelectedOptionArr(option);
    };

    // تواريخ الصلاحية
    const showSelectedCategory=(el)=>{
        setCategoryToShow(el);
        setShowExpirationDatesModal(true);
    }

    // اضافة كمية وسعر
    const showQuantity=(el)=>{
        setCategoryToShow(el);
        setShowAddQuantityModal(true);
    }



    return (
        <div className='w-75 h-100' style={{
            // overflowX:'hidden'
        }}>
            <h1>  فاتورة توريد   {isLoading && <Spinner />} </h1>

            <div className="form-group">
                <label className="my-2"> نوع الفاتورة </label>
                <input
                    value={'توريد'}
                    disabled
                    type="text" className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="my-2"> كود الفاتورة </label>
                <input
                    value={invoiceCode}
                    onChange={(e)=>setInvoiceCode(e.target.value)}
                    type="text" className="form-control"
                    placeholder="كود الفاتورة"
                />
            </div>

            <div className="form-group">
                <label className="my-2"> رقم  الفاتورة </label>
                <CustumNumberInput
                    value={invoiceNumber} setValue={setInvoiceNumber}
                    placeholder={'رقم  الفاتورة'}
                    required={true}
                />
            </div>

            <div className="form-group">
                <label className="my-2"> اسم جهة التوريد </label>
                <select
                    value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="form-control">
                    <option value={'0'}> من فضلك اختر جهة التوريد </option>
                    {
                        suppliers?.length > 0 && suppliers?.map((el, i) => <option key={i} value={el?._id}>{el?.fullName}</option>)
                    }
                </select>
            </div>

            <div className="form-group">
                <label className="my-2">  تاريخ التوريد </label>
                <input
                    value={supplyDate} onChange={(e) => setSupplyDate(e.target.value)}
                    required
                    type="date" className="form-control" placeholder="الوحدة"
                />
            </div>

            <div className="form-group">
                <label className="my-2">  تاريخ التسجيل </label>
                <input
                    value={FormatDate(new Date)}
                    disabled
                    type="text" className="form-control" />
            </div>

            {
                categories && <div className="form-group my-2">
                    <label className="my-2">  قائمة الاصناف </label>
                    <Select
                        isMulti={true}
                        value={selectedOptionArr}
                        onChange={handleChange}
                        options={categories}
                    />
                </div>
            }

            {
                 <div className='d-flex justify-content-between' style={{
                    overflow:'auto',
                    width:'100%'
                 }}>
                 <table className="table mt-3" style={{
                       width: "100%",
                       borderCollapse: "collapse"
                 }}>
                     <thead>
                         <tr>
                             <th className="text-center" scope="col"> الاسم </th>
                             <th className="text-center" scope="col">الكود  </th>
                             <th className="text-center" scope="col" style={{
                                whiteSpace: "nowrap"
                             }}> تاريخ الصلاحية </th>
                             <th className="text-center" scope="col"> سعر </th>
                             <th className="text-center" scope="col"> كمية </th>
                             <th className="text-center" scope="col"> وحدة </th>
                             <th className="text-center" scope="col"> الاجمالي </th>
                             <th className="text-center mx-auto" scope="col">تحكم</th>
                         </tr>
                     </thead>
                     <tbody>
                         {
                             selectedOptionArr?.map((el, i) =>
                                 <tr key={i}>
                                     <td className="text-center">  {el?.name}   </td>
                                     <td className="text-center" >{el?.code}</td>
                                     <td className="text-center" >
                                        <button onClick={()=>showSelectedCategory(el)} className="btn btn-success">
                                            اضغط هنا
                                        </button>
                                     </td>
                                     <td className="text-center" >{el?.unitPrice}</td>
                                     <td className="text-center" >{el?.totalQuantity}</td>
                                     <td className="text-center" >{el?.unit}</td>
                                     <td className="text-center">{Number(el?.unitPrice * el?.totalQuantity)} </td>
                                     <td className="text-center">
                                         <div className='d-flex h-25 gap-2'>
                                             {/* <button  className='btn btn-danger h-25 my-auto'> <FaTrashAlt height={'5px'} /> </button> */}
                                             <button
                                             onClick={()=>showQuantity(el)}  
                                             className='btn btn-warning h-25 my-auto mx-auto'
                                             > <CiEdit height={'5px'} /> </button>

                                         </div>
                                     </td>
                                 </tr>
                             )
                         }

                         {
                            showExpirationDatesModal&&<ExpirationDatesModal
                                show={showExpirationDatesModal} setShow={setShowExpirationDatesModal}
                                category={categoryToShow}  setCategory={setCategoryToShow}
                            />
                         }

                         {
                            showAddQuantityModal&&<AddQuantityModal
                            show={showAddQuantityModal} setShow={setShowAddQuantityModal}
                            category={categoryToShow}  setCategory={setCategoryToShow}
                            categories={categories} setCategories={setCategories}
                            setSelectedOptionArr={setSelectedOptionArr}
                            />
                         }

                     </tbody>
                 </table>
             </div>
            }



        </div>
    )
}
