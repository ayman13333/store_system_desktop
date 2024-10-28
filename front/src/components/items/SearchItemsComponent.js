import { useState } from 'react';
import FormatDate from '../../Utilities/FormatDate';

export default function SearchItemsComponent() {
    const[searchType,setSearchType]=useState('');
    const[searchValue,setSearchValue]=useState('');

    return (
        <div className="d-flex justify-content-between my-4">
            <div className="form-group d-flex gap-3">
                <label className="my-2 w-50">  تاريخ اليوم </label>
                <input
                    value={FormatDate(new Date)}
                    disabled
                    type="text" className="form-control" />
            </div>

            <div>
                <div className="form-group d-flex gap-2">
                    <select 
                    value={searchType}
                    onChange={(e)=>setSearchType(e.target.value)} 
                    className="form-control">
                        <option value={'0'}> نوع البحث </option>
                        <option value={'name'}> بالاسم </option>
                        <option value={'code'}> بالكود </option>
                    </select>
                    
                    <input
                     value={searchValue}
                     onChange={(e)=>setSearchValue(e.target.value)}
                   placeholder='ابحث هنا'
                    type="text" className="form-control" />

                </div>
            </div>



        </div>
    )
}
