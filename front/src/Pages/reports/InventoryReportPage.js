import React from 'react'
import SideBar from '../../Utilities/SideBar'
import InventoryReportComponent from '../../components/reports/InventoryReport/InventoryReportComponent'

export default function InventoryReportPage() {
  return (
    <div className='parent'>
            <SideBar />

            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }} >
                <InventoryReportComponent />
            </div>
        </div>
  )
}
