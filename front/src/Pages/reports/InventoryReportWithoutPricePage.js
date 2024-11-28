import React from 'react'
import SideBar from '../../Utilities/SideBar'
import InventoryReportWithoutPriceComponent from '../../components/reports/InventoryReportWithoutPrice/InventoryReportWithoutPriceComponent'

export default function InventoryReportWithoutPricePage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }}>
                <InventoryReportWithoutPriceComponent />
            </div>
        </div>
  )
}
