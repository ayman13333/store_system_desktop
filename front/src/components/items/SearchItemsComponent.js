import { useState } from 'react';
import FormatDate from '../../Utilities/FormatDate';
import { BsBackspaceFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

export default function SearchItemsComponent({setCategories,setIsLoading}) {
    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const search=()=>{
        if(searchType=='') return toast.error(' من فضلك اختر نوع البحث');
        const value=searchValue.trim();
     

        setCategories((prev) =>
            prev.filter(el => el?.[searchType]?.includes(value) ? el : '')
          );

    }

    const cancelFilter = async () => {
        setIsLoading(true);
        const [result] = await Promise.all([
          window?.electron?.getAllCategories()
        ]);
  
        // console.log('categories', categories);
        setIsLoading(false);
        console.log('result', result);
  
        setCategories(result?.categories);
    }

    return (
        <div className="d-flex justify-content-between my-4">
            <div className="form-group d-flex gap-3">
                <label className="my-2 w-50">  تاريخ اليوم </label>
                <input
                    value={FormatDate(new Date)}
                    disabled
                    type="text" className="form-control" />
            </div>

            <div className='d-flex gap-2'>
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
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder='ابحث هنا'
                        type="text" className="form-control" />
                </div>

                <button onClick={() => search()} className='btn btn-success'> بحث </button>

                <button onClick={() => cancelFilter()} className='btn btn-danger' > الغاء الفلتر  </button>

            </div>



        </div>
    )
}
