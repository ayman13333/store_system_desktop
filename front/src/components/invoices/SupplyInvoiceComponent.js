import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import CustumNumberInput from "../../Utilities/CustumNumberInput";
import FormatDate from "../../Utilities/FormatDate";

export default function SupplyInvoiceComponent() {
    const [isLoading, setIsLoading] = useState(false);
    // رقم  الفاتورة
    const[invoiceNumber,setInvoiceNumber]=useState('');
    // جهات التوريد
    const[suppliers,setSuppliers]=useState([]);
    // اسم جهة التوريد
    const[selectedSupplier,setSelectedSupplier]=useState('0');
    // تاريخ التوريد
    const[supplyDate,setSupplyDate]=useState('');
    // الاصناف
    const[categories,setCategories]=useState([]);

    useEffect(()=>{
        const get=async()=>{
            setIsLoading(true);
            const [result, categories] = await Promise.all([
                window?.electron?.getAllUsers({ type: 'supplier' }),
                window?.electron?.getAllCategories()
              ]);
            
            console.log('categories',categories);
              setIsLoading(false);
           // console.log('result',result);

            setSuppliers(result?.users);
            setCategories(categories?.categories);
        }

        get();
    },[]);

    const toDayDate=FormatDate(new Date);

    console.log('toDayDate',toDayDate);

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
        value={selectedSupplier} onChange={(e)=>setSelectedSupplier(e.target.value)} 
        className="form-control">
            <option value={'0'}> من فضلك اختر جهة التوريد </option>
            {
                suppliers?.length>0&&suppliers?.map((el,i)=><option key={i} value={el?._id}>{el?.fullName}</option>)
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
                    type="text" className="form-control"/>
        </div>

    </div>
  )
}
