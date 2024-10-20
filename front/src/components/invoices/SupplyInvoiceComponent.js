import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import CustumNumberInput from "../../Utilities/CustumNumberInput";

export default function SupplyInvoiceComponent() {
    const [isLoading, setIsLoading] = useState(false);
    // رقم  الفاتورة
    const[invoiceNumber,setInvoiceNumber]=useState('');
    // جهات التوريد
    const[suppliers,setSuppliers]=useState([]);
    // اسم جهة التوريد
    const[selectedSupplier,setSelectedSupplier]=useState('0');

    useEffect(()=>{
        const get=async()=>{
            setIsLoading(true);
            const result = await window?.electron?.getAllUsers({
                type: 'supplier'
              });
              setIsLoading(false);
            console.log('result',result);

            setSuppliers(result?.users);
        }

        get();
    },[]);

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

    </div>
  )
}
