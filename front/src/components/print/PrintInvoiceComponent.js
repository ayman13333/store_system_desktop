import { useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";
import SupplyInvoiceComponent from "../invoices/supplyInvoice/SupplyInvoiceComponent";
import PaymentInvoiceComponent from "../invoices/paymentInvoice/PaymentInvoiceComponent";
import ConvetInvoiceComponent from "../invoices/ConvetInvoice/ConvetInvoiceComponent";



import { useLocation, useNavigate } from "react-router-dom";


export default function PrintInvoiceComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(()=>false);
    const [foundInvoice, setFoundInvoice] = useState(()=> location?.state ? location?.state :null);

    const handlePrint=()=>{
        // /printPayentandSupplyInvoice
        navigate('/printPayentandSupplyInvoice',{
            state:foundInvoice
        });
    }
    

    

    console.log('foundInvoice', foundInvoice);
    return (
        <div className='w-75 h-100'>
            <h1> طباعة فاتورة   {isLoading && <Spinner />} </h1>
            <SearchComponent setFoundInvoice={setFoundInvoice} isLoading={isLoading} setIsLoading={setIsLoading} />
            {
                foundInvoice?.type == 'supply' &&<div id="invoice"> <SupplyInvoiceComponent type={'print'} invoice={foundInvoice} /> </div> 
            }

            {
                foundInvoice?.type == 'payment' && <PaymentInvoiceComponent type={'print'} invoice={foundInvoice} />
            }

            {
                foundInvoice?.type=='convert' && <ConvetInvoiceComponent type={'print'} invoice={foundInvoice} />
            }

            {
                foundInvoice && <div>
                    <button
                         onClick={() => handlePrint()}
                        disabled={isLoading}
                        className='btn btn-primary'> طباعة </button>
                </div>
            }

        </div>
    )
}
