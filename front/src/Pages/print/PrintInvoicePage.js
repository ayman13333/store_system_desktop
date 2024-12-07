import PrintInvoiceComponent from "../../components/print/PrintInvoiceComponent";
import SideBar from "../../Utilities/SideBar";

export default function PrintInvoicePage() {
  return (
    <div className='parent'>
    <SideBar />
    <div className="p-4 w-100">
    <PrintInvoiceComponent />
    </div>    

</div>
  )
}
