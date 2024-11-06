import React from 'react'
import SideBar from '../../Utilities/SideBar'
import ConvetInvoiceComponent from '../../components/invoices/ConvetInvoice/ConvetInvoiceComponent'

export default function ConvetInvoicePage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">
                <ConvetInvoiceComponent />
            </div>
        </div>
  )
}
