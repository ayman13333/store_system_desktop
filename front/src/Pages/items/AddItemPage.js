import React from 'react'
import SideBar from '../../Utilities/SideBar'
import AddItemComponent from '../../components/items/AddItemComponent'

export default function AddItemPage() {
    return (
        <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">

                <AddItemComponent />
            </div>
        </div>
    )
}
