import React from 'react';
import SideBar from '../../Utilities/SideBar';
import PaymentInvoiceComponent from '../../components/invoices/paymentInvoice/PaymentInvoiceComponent';

export default function PaymentInvoicePage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">
                <PaymentInvoiceComponent />
            </div>
        </div>
  )
}
