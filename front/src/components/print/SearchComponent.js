import { useState } from "react";
import { toast } from "react-toastify";

export default function SearchComponent() {
    const [searchValue, setSearchValue] = useState('');

    const search= async()=>{
        try {
            if(searchValue=='') return toast.error(' من فضلك ادخل كود الفاتورة');
            const code=searchValue.trim();
            const data={code};
            // searchForInvoiceByCode
            const {success,foundInvoice}=await window?.electron?.searchForInvoiceByCode(data); 
            if(success==true){
                console.log('invoice',foundInvoice);
            }
            else{

            }
        } catch (error) {
            console.log("error",error.message);
            toast.error(' حدث خطأ حاول مرة اخري');
        }
       
    }
  return (
    <div className="d-flex justify-content-end my-3">
        <div className='d-flex gap-2 my-2'>
                <div className="d-flex gap-2">
                    <input
                        value={searchValue}
                        onKeyDown={(event)=>{
                            if (event.key === "Enter") {
                                search();
                              }
                        }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder='ابحث هنا'
                        type="text" className="form-control" />
                </div>

                <button onClick={() => search()} className='btn btn-success'> بحث </button>

                {/* <button onClick={() => cancelFilter()} className='btn btn-danger' > refresh  </button> */}

            </div>
    </div>
  )
}
