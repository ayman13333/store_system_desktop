import React from 'react'
import SideBar from '../../Utilities/SideBar'
import ItemTransactionReportComponent from '../../components/reports/ItemTransactionReport/ItemTransactionReportComponent'

export default function InventoryReportPage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">
                <ItemTransactionReportComponent />
            </div>
        </div>
  )
}
