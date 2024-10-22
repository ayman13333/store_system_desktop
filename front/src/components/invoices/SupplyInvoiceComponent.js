import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import CustumNumberInput from "../../Utilities/CustumNumberInput";
import FormatDate from "../../Utilities/FormatDate";
import Select from 'react-select';
import { FaTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

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
     // State to store the selected option
    const [selectedOptionArr, setSelectedOptionArr] = useState(null);
    const[showExpirationDatesModal,setShowExpirationDatesModal]=useState(false);
    

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

    return (
        <div className='w-75 h-100'>
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
                 <div className='d-flex justify-content-between'>
                 <table className="table mt-3">
                     <thead>
                         <tr>
                             <th scope="col"> الاسم </th>
                             <th scope="col">الكود  </th>
                             <th scope="col"> تاريخ الصلاحية </th>
                             <th scope="col"> سعر </th>
                             <th scope="col"> كمية </th>
                             <th scope="col"> وحدة </th>
                             <th scope="col"> الاجمالي </th>
                             <th scope="col">تحكم</th>
                         </tr>
                     </thead>
                     <tbody>
                         {
                             selectedOptionArr?.map((el, i) =>
                                 <tr key={i}>
                                     <td> {el?.name} </td>
                                     <td >{el?.code}</td>
                                     <td >
                                        <button className="btn btn-success">
                                            اضغط هنا
                                        </button>
                                     </td>
                                     <td >{el?.unitPrice}</td>
                                     <td >{el?.totalQuantity}</td>
                                     <td >{el?.unit}</td>
                                     <td>{Number(el?.unitPrice * el?.totalQuantity)} </td>
                                     <td>
                                         <div className='d-flex h-25 gap-2'>
                                             {/* <button  className='btn btn-danger h-25 my-auto'> <FaTrashAlt height={'5px'} /> </button> */}
                                             <button  className='btn btn-warning h-25 my-auto'> <CiEdit height={'5px'} /> </button>

                                         </div>
                                     </td>
                                 </tr>
                             )
                         }

                     </tbody>
                 </table>
             </div>
            }



        </div>
    )
}
