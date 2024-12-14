import { useState } from "react";
import { toast } from "react-toastify";

export default function SearchComponent({ setFoundInvoice, setIsLoading, isLoading }) {
    const [searchValue, setSearchValue] = useState('');

    const search = async () => {
        try {
            if (searchValue == '') return toast.error(' من فضلك ادخل كود الفاتورة');
            const code = searchValue.trim();
            const data = { code };
            // searchForInvoiceByCode
            setIsLoading(true);
            const { success, foundInvoice } = await window?.electron?.searchForInvoiceByCode(data);
            setIsLoading(false);

            if (success == true) {
                // console.log('invoice',foundInvoice);
                setFoundInvoice(foundInvoice);
            }
            else {
                setFoundInvoice(null);
            }
        } catch (error) {
            console.log("error", error.message);
            toast.error(' حدث خطأ حاول مرة اخري');
        }

    }
    return (
        <div className="d-flex justify-content-end my-3">
            <div className='d-flex gap-2 my-2'>
                <div className="d-flex gap-2">
                    <input
                        value={searchValue}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                search();
                            }
                        }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder='البحث بكود الفاتورة'
                        type="text" className="form-control" />
                </div>

                <button disabled={isLoading} onClick={() => search()} className='btn btn-success'> بحث </button>

                

            </div>
        </div>
    )
}
