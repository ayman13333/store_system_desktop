import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiRefreshCcw } from "react-icons/fi";
import RegenerateInvoicesCodeModal from './RegenerateInvoicesCodeModal';

export default function SearchItemsComponent({setCategories,setIsLoading,originalCategories}) {
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const[showModal,setShowModal]=useState(false);

    const search=()=>{
        if(searchType=='') return toast.error(' من فضلك اختر نوع البحث');
        if(searchValue=='') return toast.error(' من فضلك اكتب ما تريد البحث عنه');
        const value=searchValue.trim();
     

        // setCategories((prev) =>
        //     prev.filter(el => el?.[searchType]?.includes(value) ? el : '')
        //   );
        let categoriesAfterSearch=[];

        if(searchType=='name')
            categoriesAfterSearch=originalCategories.filter(el => el?.[searchType]?.includes(value) ? el : '');
        else
        categoriesAfterSearch=originalCategories.filter(el => el?.[searchType]==value);
        

        setCategories(categoriesAfterSearch);

    }

    const cancelFilter = async () => {
        // setIsLoading(true);
        // const [result] = await Promise.all([
        //   window?.electron?.getAllCategories()
        // ]);
  
        // // console.log('categories', categories);
        // setIsLoading(false);
        // console.log('result', result);
  
        setCategories(originalCategories);
        setSearchType('');
        setSearchValue('');
    }

    // const regenerateInvoicesCodeFunc=async()=>{

    // }

    return (
        <div className="d-flex justify-content-between my-4">
            {/* <div className="form-group d-flex gap-3">
                <label className="my-2 w-50">  تاريخ اليوم </label>
                <input
                    value={FormatDate(new Date)}
                    disabled
                    type="text" className="form-control" />
            </div> */}

            <div className='d-flex gap-2 my-3'>
                <div className="d-flex gap-2">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="form-control">
                        <option value={'0'}> نوع البحث </option>
                        <option value={'name'}> بالاسم </option>
                        <option value={'code'}> بالكود </option>
                    </select>

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
                <button onClick={() => cancelFilter()} className='btn btn-danger' style={{width: '80px'}} > <FiRefreshCcw size={'24px'}/>   </button>
                <button onClick={() => setShowModal(true)} className='btn btn-success'> اعادة تهيئة كود الفاتورة </button>
            </div>


                    {
                        showModal&&<RegenerateInvoicesCodeModal show={showModal} setShow={setShowModal} />
                    }
        </div>
    )
}
