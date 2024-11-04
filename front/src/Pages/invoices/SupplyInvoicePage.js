import SupplyInvoiceComponent from "../../components/invoices/supplyInvoice/SupplyInvoiceComponent";
import SideBar from "../../Utilities/SideBar";

export default function SupplyInvoicePage() {
    return (
        <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">
                <SupplyInvoiceComponent />
            </div>
        </div>
    )
}
