import { useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";
import SupplyInvoiceComponent from "../invoices/supplyInvoice/SupplyInvoiceComponent";

export default function PrintInvoiceComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [foundInvoice, setFoundInvoice] = useState(null);

    console.log('foundInvoice', foundInvoice);
    return (
        <div className='w-75 h-100'>
            <h1> صفحة الطباعة   {isLoading && <Spinner />} </h1>
            <SearchComponent setFoundInvoice={setFoundInvoice} isLoading={isLoading} setIsLoading={setIsLoading} />
            {
                foundInvoice?.type == 'supply' && <SupplyInvoiceComponent type={'print'} invoice={foundInvoice} />
            }

            {
                foundInvoice && <div>
                    <button
                        // onClick={() => addNewInvoice()}
                        disabled={isLoading}
                        className='btn btn-primary'> طباعة </button>
                </div>
            }

        </div>
    )
}
