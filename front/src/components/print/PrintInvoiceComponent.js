import { useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";
import SupplyInvoiceComponent from "../invoices/supplyInvoice/SupplyInvoiceComponent";
import PaymentInvoiceComponent from "../invoices/paymentInvoice/PaymentInvoiceComponent";
import ConvetInvoiceComponent from "../invoices/ConvetInvoice/ConvetInvoiceComponent";

import { useLocation, useNavigate } from "react-router-dom";
import ConfirmEditModal from "../items/ConfirmEditModal";
import { toast } from "react-toastify";


export default function PrintInvoiceComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(() => false);
  const [foundInvoice, setFoundInvoice] = useState(() => location?.state ? location?.state : null);
  const [showDeleteModal, setShowDeleteModal] = useState(() => false);

  const getCurrentDate = () => {
    const now = new Date();

    // First variable: day, month, and year
    const datePart = {
      day: String(now.getDate()).padStart(2, '0'), // Add leading zero if needed
      month: String(now.getMonth() + 1).padStart(2, '0'), // Months are zero-based
      year: now.getFullYear(),
    };

    // Second variable: time with AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'مساءََ' : 'صباحاََ';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)

    const timePart = `${hours}:${minutes} ${amPm}`;

    return { datePart, timePart };
  };

  // Store the values in variables
  const { datePart, timePart } = getCurrentDate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handlePrint = () => {

    const printWindow = window.open('', '', 'height=800,width=1200');

    // Start writing the HTML content
    printWindow.document.write('<html><head><title> فاتورة </title><style>');

    // CSS for printing
    printWindow.document.write(`
          @media print {
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              direction: rtl; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              direction: rtl; 
            }
            th, td { 
              padding: 10px; 
              text-align: right; 
              border: 1px solid #ddd; 
            }
            th { 
              font-size: 16px; 
              font-weight: bold; 
              background-color: #f1f1f1; 
            }
            td { 
              font-size: 14px; 
            }
            @page { 
              margin: 20mm; 
              direction: rtl; 
            }
          }
        `);

    printWindow.document.write('</style></head><body>');

    // Header with time and date
    printWindow.document.write(`
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
            <div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>
            <div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>
          </div>
        `);


    // Title
    printWindow.document.write(`
          <div>
            <h2 style="text-align: center; text-decoration: underline; font-size:28px; font-weight:800">
            ${foundInvoice?.type === "supply"
        ? "فاتورة توريد"
        : foundInvoice?.type === "payment"
          ? "فاتورة صرف"
          : foundInvoice?.type === "convert"
            ? "فاتورة تحويل"
            : ""
      }
              
            </h2>
          </div>
        `);



    printWindow.document.write(`
            <div>
            <div class="table-container">
              <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
            
                  <tr>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800;">كود الفاتورة</th>
                    <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.invoiceCode}</td>
                  </tr>
                  <tr>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">رقم الفاتورة</th>
                  <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.serialNumber}</td>
                  </tr>
                  <tr>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800;">  ${foundInvoice?.type === "supply"
        ? " اسم جهة التوريد"
        : foundInvoice?.type === "payment"
          ? "اسم جهة الصرف"
          : foundInvoice?.type === "convert"
            ? "اسم جهة التحويل"
            : ""
      }</th>
              <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.supplierID?.fullName}</td>
              </tr>
              <tr>
                <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ الفاتورة</th>
                <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.supplyDate)}</td>
              </tr>
              <tr>
                <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ التسجيل</th>
                <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.registerDate)}</td>
              </tr>
              <tr>
                <th style="padding: 8px; font-size: 24px; font-weight: 800;">اسم الموظف</th>
                <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.employeeID?.email}</td>
              </tr>
              <tr>
                <th style="padding: 8px; font-size: 24px; font-weight: 800;">ملاحظات </th>
                <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.notes}</td>
              </tr>
              
                <tbody>
                </div>

                
          `);



    // printWindow.document.write(`
    //   <div >
    //     <h2 style="text-align: center;  font-size:20px; font-weight:700">
    //     ${
    //         foundInvoice?.type === "supply"
    //           ? "قائمة الاصناف"
    //           : foundInvoice?.type === "payment"
    //           ? "قائمة الاصناف"
    //           : foundInvoice?.type === "convert"
    //           ? "قائمة الاصناف قبل تحويلها"
    //           : ""
    //       }

    //     </h2>
    //   </div>
    // `);


    // Table
    printWindow.document.write(`



            <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
                      <div class="table-container">
             <div >
            <h2 style="text-align: center;  font-size:20px; font-weight:700">
            ${foundInvoice?.type === "supply"
        ? "قائمة الاصناف"
        : foundInvoice?.type === "payment"
          ? "قائمة الاصناف"
          : foundInvoice?.type === "convert"
            ? "قائمة الاصناف قبل تحويلها"
            : ""
      }
              
            </h2>
          </div>

              <thead>
                <tr>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكود</th>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاسم</th>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">الوحدة</th>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكمية</th>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">سعر الوحدة</th>
                  <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاجمالي</th>
                </tr>
              </thead>
              <tbody>
        `);

    // Populate rows and calculate totals
    let totalUnitPrice = 0;

    foundInvoice?.invoicesData.forEach(row => {
      const rowTotal = row.unitPrice * row.totalQuantity;
      totalUnitPrice += rowTotal;

      printWindow.document.write(`
            <tr>
              <td style="min-width: 200px; padding: 5px;">${row.code}</td>
              <td style="min-width: 200px; padding: 5px;">${row.name}</td>
              <td style="min-width: 200px; padding: 5px;">${row.unit}</td>
              <td style="min-width: 200px; padding: 5px;">${row.totalQuantity}</td>
              <td style="min-width: 200px; padding: 5px;">${row.unitPrice.toFixed(2)}</td>
              <td style="min-width: 200px; padding: 5px;">${rowTotal.toFixed(2)}</td>
            </tr>
          `);
    });


    // Close table body
    printWindow.document.write(`
              </tbody>
            </table>
          </div>
        `);

    // Footer with total price
    printWindow.document.write(`
          <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
            <div><h2 style="margin: 0;">   ${foundInvoice?.type === "supply"
        ? "إجمالي الاصناف"
        : foundInvoice?.type === "payment"
          ? "إجمالي الاصناف"
          : foundInvoice?.type === "convert"
            ? "إجمالي الاصناف قبل تحويلها"
            : ""
      }   : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
          </div>
        `);


    if (foundInvoice?.invoicesData2.length > 0) {
      printWindow.document.write(`
                <div>
            <h2 style="text-align: center;  font-size:20px; font-weight:700">
                    قائمة الاصناف بعد تحويلها
                  </h2>
                </div>
              `);

      // Table
      printWindow.document.write(`
                <div class="table-container">
                  <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
                    <thead>
                      <tr>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكود</th>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاسم</th>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">الوحدة</th>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكمية</th>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">سعر الوحدة</th>
                        <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
              `);

      // Populate rows and calculate totals
      let totalUnitPrice = 0;

      foundInvoice?.invoicesData2.forEach(row => {
        const rowTotal = row.unitPrice * row.totalQuantity;
        totalUnitPrice += rowTotal;

        printWindow.document.write(`
                  <tr>
                    <td style="min-width: 200px; padding: 5px;">${row.code}</td>
                    <td style="min-width: 200px; padding: 5px;">${row.name}</td>
                    <td style="min-width: 200px; padding: 5px;">${row.unit}</td>
                    <td style="min-width: 200px; padding: 5px;">${row.totalQuantity}</td>
                    <td style="min-width: 200px; padding: 5px;">${row.unitPrice.toFixed(2)}</td>
                    <td style="min-width: 200px; padding: 5px;">${rowTotal.toFixed(2)}</td>
                  </tr>
                `);
      });

      // Close table body
      printWindow.document.write(`
            </tbody>
          </table>
        </div>
      `);

      // Footer with total price
      printWindow.document.write(`
        <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
          <div><h2 style="margin: 0;">إجمالي سعر الأصناف  بعد تحويلها : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
        </div>
      `);

    }
    // Close HTML
    printWindow.document.write('</body></html>');

    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.print();
  };



  const loggedUser = JSON.parse(localStorage.getItem('user'));


  const deleteInvoiceFunction=async()=>{
    try {
      let data={
        invoiceCode:foundInvoice?.invoiceCode
      }
      // deleteInvoice
      setIsLoading(true);
      let result=await window?.electron?.deleteInvoice(data);
      setIsLoading(false);

      if(result?.success){
        setShowDeleteModal(false);
        setFoundInvoice(null);
       return toast.success('تم حذف الفاتورة بنجاح');
      }

    } catch (error) {
      console.log('error',error?.message);
      setIsLoading(false);
      return toast.error('فشل في عملية الحذف');

    }
  }




  console.log('foundInvoice', foundInvoice);
  return (
    <div className='w-75 h-100'>
      <h1> طباعة فاتورة   {isLoading && <Spinner />} </h1>
      {!location.state && <SearchComponent setFoundInvoice={setFoundInvoice} isLoading={isLoading} setIsLoading={setIsLoading} />
      }            {
        foundInvoice?.type == 'supply' && <div id="invoice"> <SupplyInvoiceComponent type={'print'} invoice={foundInvoice} /> </div>
      }

      {
        foundInvoice?.type == 'payment' && <PaymentInvoiceComponent type={'print'} invoice={foundInvoice} />
      }

      {
        foundInvoice?.type == 'convert' && <ConvetInvoiceComponent type={'print'} invoice={foundInvoice} />
      }

      {
        foundInvoice && <div className="d-flex justify-content-between">
          <button
            onClick={() => handlePrint()}
            disabled={isLoading}
            className='btn btn-primary'> طباعة </button>
          {
            loggedUser?.type == "admin" &&
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger">
              حذف
            </button>
          }

        </div>
      }

      {
        showDeleteModal && <ConfirmEditModal 
        func={deleteInvoiceFunction}
        show={showDeleteModal} 
        setShow={setShowDeleteModal} 
        type={'delete'} />
      }
    </div>
  )
}





