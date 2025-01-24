import React from 'react'
import SideBar from '../../Utilities/SideBar'
import EntityTransactionItemsReportComponent from '../../components/reports/EntityTransactionItemsReport/EntityTransactionItemsReportComponent'

export default function EntityTransactionItemsReportPage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }}>
                <EntityTransactionItemsReportComponent />
            </div>
        </div>
  )
}
