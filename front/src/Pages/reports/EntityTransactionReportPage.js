import React from 'react'
import SideBar from '../../Utilities/SideBar'
import EntityTransactionReportComponent from '../../components/reports/EntityTransactionReport/EntityTransactionReportComponent'

export default function InventoryReportPage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }}>
                <EntityTransactionReportComponent />
            </div>
        </div>
  )
}
