import React from 'react'
import SideBar from '../../Utilities/SideBar'
import FinancialTransactionsReportComponent from '../../components/reports/FinancialTransactionsReport/FinancialTransactionsReportComponent'

export default function InventoryReportPage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }} >
                <FinancialTransactionsReportComponent />
            </div>
        </div>
  )
}
