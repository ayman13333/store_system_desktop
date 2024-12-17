import { useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";
import SupplyInvoiceComponent from "../invoices/supplyInvoice/SupplyInvoiceComponent";
import PaymentInvoiceComponent from "../invoices/paymentInvoice/PaymentInvoiceComponent";
import ConvetInvoiceComponent from "../invoices/ConvetInvoice/ConvetInvoiceComponent";

import { useLocation, useNavigate } from "react-router-dom";
import ConfirmEditModal from "../items/ConfirmEditModal";
import { toast } from "react-toastify";
import logo from '../reports/InventoryReportWithoutPrice/logo.jpeg'


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
              font-size: 18px; 
              font-weight: bold; 
              background-color: #f1f1f1; 
              }
              td { 
                font-size: 16px; 
                font-weight: 500; 
            }
            @page { 
              margin: 20mm; 
              direction: rtl; 
          size: A4 landscape; /* Set page size to A4 and rotate to landscape */

            }
          }
        `);

    printWindow.document.write('</style></head><body>');

    // Header with time and date
    // printWindow.document.write(`
    //       <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
    //         <div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>
    //         <div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>
    //       </div>
    //     `);

     printWindow.document.write(`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                <img src=${logo} alt="Logo" style="max-width: 70px; height: 70px;">
                <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 24px; font-weight: 900; margin-left: 20px; text-decoration: underline;">
                  <div>دار ضباط الحرب الكيميائية</div>
                  <div>جاردينيا</div>
                </div>
              </div>
            `);

    // Title
    if (foundInvoice?.type === "supply") {
      printWindow.document.write(`
        <div>
          <!-- First line: Invoice code and date -->
          <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; text-decoration: underline; font-family: Arial, cairo;">
            <span >كود الفاتورة رقم </span> <span style="color:#fff">..</span> <span>( ${foundInvoice?.invoiceCode} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span>${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
          
          
          <!-- Second line: Supplier name -->
          <div style="display: flex; margin-bottom:10px; text-decoration: underline; justify-content: center; align-items: center; font-weight: bold; font-size: 28px; direction: rtl;  font-family: Arial, cairo;">
            <span>الاصناف الواردة بيد </span> <span style="color:#fff">..</span><span>${foundInvoice?.supplierID?.fullName}</span>
          </div>
        </div>
      `);
    }
    if (foundInvoice?.type === "payment") {
      printWindow.document.write(`
        <div>
          <!-- First line: Invoice code and date -->
          <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; text-decoration: underline; margin-bottom:5px; font-family: Arial, cairo;">
            <span >فاتورة صرف اصناف من مخزن التغذية و المشروبات</span>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; text-decoration: underline; font-family: Arial, cairo;">
            <span >كود الفاتورة رقم </span> <span style="color:#fff">..</span> <span>( ${foundInvoice?.invoiceCode} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span>${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
          
          
          <!-- Second line: Supplier name -->
          <div style="display: flex; margin-bottom:10px; text-decoration: underline; justify-content: center; align-items: center; font-weight: bold; font-size: 28px; direction: rtl;  font-family: Arial, cairo;">
            <span>الي قسم  </span> <span style="color:#fff">..</span><span>${foundInvoice?.supplierID?.fullName}</span> <span style="color:#fff">..</span>
            <span> تاريخ التسجيل</span> <span style="color:#fff">..</span><span>${formatDate(foundInvoice?.registerDate)}</span>
          </div>
        </div>
      `);
    }

   



    // printWindow.document.write(`
    //         <div>
    //         <div class="table-container">
    //           <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
            
    //               <tr>
    //                 <th style="padding: 8px; font-size: 24px; font-weight: 800;">كود الفاتورة</th>
    //                 <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.invoiceCode}</td>
    //               </tr>
    //               <tr>
    //               <th style="padding: 8px; font-size: 24px; font-weight: 800;">رقم الفاتورة</th>
    //               <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.serialNumber}</td>
    //               </tr>
    //               <tr>
    //                 <th style="padding: 8px; font-size: 24px; font-weight: 800;">  ${foundInvoice?.type === "supply"
    //     ? " اسم جهة التوريد"
    //     : foundInvoice?.type === "payment"
    //       ? "اسم جهة الصرف"
    //       : foundInvoice?.type === "convert"
    //         ? "اسم جهة التحويل"
    //         : ""
    //   }</th>
    //           <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.supplierID?.fullName}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ الفاتورة</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.supplyDate)}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ التسجيل</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.registerDate)}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">اسم الموظف</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.employeeID?.email}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">ملاحظات </th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.notes}</td>
    //           </tr>
              
    //             <tbody>
    //             </div>

                
    //       `);



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
    if (foundInvoice?.type === "supply") {
            printWindow.document.write(`

              <table border="5" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
                        <div class="table-container">
               <div >
            </div>
  
        <thead style="border-bottom: 5px solid black;">
                  <tr>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">م</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الكود</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الصنف</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الوحدة</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الكمية</th>
                  </tr>
                </thead>
                <tbody>
          `);
    }
    // Populate rows and calculate totals
    let totalUnitPrice = 0;

    foundInvoice?.invoicesData.forEach((row,index) => {
      const rowTotal = row.unitPrice * row.totalQuantity;
      totalUnitPrice += rowTotal;
      if (foundInvoice?.type === "supply") {
          printWindow.document.write(`
          <tr style="padding:5px; border-right: 2px solid black;">
                <td style="min-width: 200px; padding: 5px; border-right: 5px solid black;">${index+1}</td>
                <td style="min-width: 200px; padding: 5px; border-right: 5px solid black;">${row.code}</td>
                <td style="min-width: 200px; padding: 5px; border-right: 5px solid black;">${row.name}</td>
                <td style="min-width: 200px; padding: 5px; border-right: 5px solid black;">${row.unit}</td>
                </tr>
                
              
              
            `);
      }
            
    });
    if (foundInvoice?.type != 'convert'){
      printWindow.document.write(`
      <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; text-align: center;">
          <td colspan="7" style="padding: 5px; border-right: 5px solid black; font-size: 28px;">
          <span> الاجمالي    </span>
          <span style="margin: 0 5px;"> ${totalUnitPrice.toFixed(2)} </span>
          <span>جنيه</span>
          </td>
        </tr>
          <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; text-align: center;">
          <td colspan="1" style="padding: 5px; border-right: 5px solid black; font-size: 28px;">
          ملاحظات
          </td>
          <td colspan="6" style="padding: 5px; border-right: 5px solid black; font-size: 28px;">
          </td>

        </tr>
      `);
    }

    // Close table body
    printWindow.document.write(`
              </tbody>
            </table>
          </div>
        `);

    // Footer with total price
    // printWindow.document.write(`
    //       <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
    //         <div><h2 style="margin: 0;">   ${foundInvoice?.type === "supply"
    //     ? "إجمالي الاصناف"
    //     : foundInvoice?.type === "payment"
    //       ? "إجمالي الاصناف"
    //       : foundInvoice?.type === "convert"
    //         ? "إجمالي الاصناف قبل تحويلها"
    //         : ""
    //   }   : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
    //       </div>
    //     `);


        printWindow.document.write(`
          <div style="display: flex; justify-content: space-between; direction: rtl;">
        
            <!-- First column: أمين العهدة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>أمين العهدة</span>
            </div>
        
            <!-- Second column: مراقب الجودة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>مراقب الجودة</span>
            </div>
        
            <!-- Third column: رئيس القسم المختص -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>رئيس القسم المختص</span>
            </div>
        
            <!-- Fourth column: مديـر الــدار -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
             <div>
             <span> يعتمد، </span>
             <span style="color:#ffffff">.............</span>
             </div>
             <div>
             <span>مديـر الــدار</span>
             <span style="color:#ffffff">.............</span>
            </div>
            </div>
        
          </div>
        `);
        
    // if (foundInvoice?.invoicesData2.length > 0) {
    //   printWindow.document.write(`
    //             <div>
    //         <h2 style="text-align: center;  font-size:20px; font-weight:700">
    //                 قائمة الاصناف بعد تحويلها
    //               </h2>
    //             </div>
    //           `);

    //   // Table
    //   printWindow.document.write(`
    //             <div class="table-container">
    //               <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
    //                 <thead>
    //                   <tr>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكود</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاسم</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الوحدة</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكمية</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">سعر الوحدة</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاجمالي</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //           `);

    //   // Populate rows and calculate totals
    //   let totalUnitPrice = 0;

    //   foundInvoice?.invoicesData2.forEach(row => {
    //     const rowTotal = row.unitPrice * row.totalQuantity;
    //     totalUnitPrice += rowTotal;

    //     printWindow.document.write(`
    //               <tr>
    //                 <td style="min-width: 200px; padding: 5px;">${row.code}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.name}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.unit}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.totalQuantity}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.unitPrice.toFixed(2)}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${rowTotal.toFixed(2)}</td>
    //               </tr>
    //             `);
    //   });

    //   // Close table body
    //   printWindow.document.write(`
    //         </tbody>
    //       </table>
    //     </div>
    //   `);

    //   // Footer with total price
    //   printWindow.document.write(`
    //     <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
    //       <div><h2 style="margin: 0;">إجمالي سعر الأصناف  بعد تحويلها : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
    //     </div>
    //   `);

    // }
    // Close HTML
    printWindow.document.write('</body></html>');

    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.print();
  };



  const handlePrintConvertInvoice = () => {

    

    const mergedArray = foundInvoice?.invoicesData?.map((el, index) => {
      const invoice2 = foundInvoice.invoicesData2?.[index] || {};
    
      // Dynamically rename keys in invoice2 by appending '2'
      const renamedInvoice2 = Object.fromEntries(
        Object.entries(invoice2).map(([key, value]) => [`${key}2`, value])
      );
    
      return {
        ...el,           // Spread the first array's object
        ...renamedInvoice2, // Spread the renamed keys from the second array
      };
    }) || [];
    
    let convertInvoiceObj={
      ...foundInvoice,
      invoicesData:[
        ...foundInvoice?.invoicesData,
        ...foundInvoice?.invoicesData2
      ]
        
      
    };
    console.log('mergedArray',mergedArray);
    
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
              font-size: 18px; 
              font-weight: bold; 
              background-color: #f1f1f1; 
              }
              td { 
                font-size: 16px; 
                font-weight: 500; 
            }
            @page { 
              margin: 20mm; 
              direction: rtl; 
          size: A4 landscape; /* Set page size to A4 and rotate to landscape */

            }
          }
        `);

    printWindow.document.write('</style></head><body>');

    // Header with time and date
    // printWindow.document.write(`
    //       <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
    //         <div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>
    //         <div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>
    //       </div>
    //     `);

     printWindow.document.write(`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                <img src=${logo} alt="Logo" style="max-width: 70px; height: 70px;">
                <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 24px; font-weight: 900; margin-left: 20px; text-decoration: underline;">
                  <div>دار ضباط الحرب الكيميائية</div>
                  <div>جاردينيا</div>
                </div>
              </div>
            `);


    if (foundInvoice?.type === "convert") {
      printWindow.document.write(`
        <div>
          <!-- First line: Invoice code and date -->


          <div style=" display: flex; justify-content: center; align-items: center; font-weight:900;  text-underline-offset: 7px; font-size:32px; direction: rtl; text-decoration: underline; font-family: Arial, cairo;">
          فاتورة تحويل 
          </div>
          <div style=" margin:20px 0; display: flex; justify-content: center; align-items: center; font-weight:900;  text-underline-offset: 7px; font-size:32px; direction: rtl; text-decoration: underline; font-family: Arial, cairo;">
            <span >كود الفاتورة رقم </span> <span style="color:#fff">..</span> <span>( ${foundInvoice?.invoiceCode} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span>${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
          <div style=" margin:0 0 0 20px; display: flex; justify-content: center; align-items: center; font-weight:900;  text-underline-offset: 7px; font-size:32px; direction: rtl; text-decoration: underline; font-family: Arial, cairo;">
            <span > فاتورة رقم </span> <span style="color:#fff">..</span> <span>( ${foundInvoice?.serialNumber} )</span ><span style="color:#fff">..</span>
            <span >  بتاريخ تسجيل </span> <span style="color:#fff">..</span> <span>${formatDate(foundInvoice?.registerDate)}</span>
          </div>
          
        </div>
      `);
    }
   



    // printWindow.document.write(`
    //         <div>
    //         <div class="table-container">
    //           <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
            
    //               <tr>
    //                 <th style="padding: 8px; font-size: 24px; font-weight: 800;">كود الفاتورة</th>
    //                 <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.invoiceCode}</td>
    //               </tr>
    //               <tr>
    //               <th style="padding: 8px; font-size: 24px; font-weight: 800;">رقم الفاتورة</th>
    //               <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.serialNumber}</td>
    //               </tr>
    //               <tr>
    //                 <th style="padding: 8px; font-size: 24px; font-weight: 800;">  ${foundInvoice?.type === "supply"
    //     ? " اسم جهة التوريد"
    //     : foundInvoice?.type === "payment"
    //       ? "اسم جهة الصرف"
    //       : foundInvoice?.type === "convert"
    //         ? "اسم جهة التحويل"
    //         : ""
    //   }</th>
    //           <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.supplierID?.fullName}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ الفاتورة</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.supplyDate)}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">تاريخ التسجيل</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${formatDate(foundInvoice?.registerDate)}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">اسم الموظف</th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.employeeID?.email}</td>
    //           </tr>
    //           <tr>
    //             <th style="padding: 8px; font-size: 24px; font-weight: 800;">ملاحظات </th>
    //             <td style="padding: 8px; font-size: 24px; font-weight: 800;">${foundInvoice?.notes}</td>
    //           </tr>
              
    //             <tbody>
    //             </div>

                
    //       `);



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
  
  
  
              <table border="5" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
                        <div class="table-container">
               <div >
            </div>
  
        <thead style="border-bottom: 5px solid black;">
                  <tr>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">م</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الصنف قبل التحويل</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الوحدة</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الكمية</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الصنف بعد التحويل</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;"> الوحدة</th>
                    <th style="padding: 8px; font-size: 24px; font-weight: 800; border-right: 5px solid black;">الكمية</th>
                  </tr>
                </thead>
                <tbody>
          `);
    
    // Populate rows and calculate totals
    let totalUnitPrice = 0;
    let totalUnitPrice2 = 0;

    mergedArray.forEach((row,index) => {
      if(row.unitPrice){
        const rowTotal = row.unitPrice * row.totalQuantity;
        totalUnitPrice += rowTotal;
      }
    if(row.unitPrice2){
      const rowTotal2 = row.unitPrice2 * row.totalQuantity2;
      totalUnitPrice2 += rowTotal2;
    }
        printWindow.document.write(`
          <tr style="padding:5px; border-right: 2px solid black;">
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${index+1}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.name ? row.name : ""}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.unit ? row.unit : ""}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.totalQuantity ? row.totalQuantity : ""}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.name2 ? row.name2 : ""}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.unit2 ? row.unit2 : ""}</td>
                <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.totalQuantity2 ? row.totalQuantity2 : ""}</td>

                </tr>
                
              
              
            `);
      
            
    });
      printWindow.document.write(`

          <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; text-align: center;">
          <td colspan="1" style="padding: 5px; border-right: 5px solid black; font-size: 28px;">
          ملاحظات
          </td>
          <td colspan="6" style="padding: 5px; border-right: 5px solid black; font-size: 28px;">
          </td>

        </tr>
      
      `);
    

    // Close table body
    printWindow.document.write(`
              </tbody>
            </table>
          </div>
        `);

    // Footer with total price
    // printWindow.document.write(`
    //       <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
    //         <div><h2 style="margin: 0;">   ${foundInvoice?.type === "supply"
    //     ? "إجمالي الاصناف"
    //     : foundInvoice?.type === "payment"
    //       ? "إجمالي الاصناف"
    //       : foundInvoice?.type === "convert"
    //         ? "إجمالي الاصناف قبل تحويلها"
    //         : ""
    //   }   : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
    //       </div>
    //     `);


        printWindow.document.write(`
          <div style="display: flex; justify-content: space-between; direction: rtl; margin:50px 0 0 0 ">
        
            <!-- First column: أمين العهدة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>أمين العهدة</span>
            </div>
        
            <!-- Second column: مراقب الجودة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>مراقب الجودة</span>
            </div>
        
            <!-- Third column: رئيس القسم المختص -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>رئيس القسم المختص</span>
            </div>
        
            <!-- Fourth column: مديـر الــدار -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 28px; direction: rtl; margin: 10px;">
             <div>
             <span> يعتمد، </span>
             <span style="color:#ffffff">.............</span>
             </div>
             <div>
             <span>مديـر الــدار</span>
             <span style="color:#ffffff">.............</span>
            </div>
            </div>
        
          </div>
        `);
        
    // if (foundInvoice?.invoicesData2.length > 0) {
    //   printWindow.document.write(`
    //             <div>
    //         <h2 style="text-align: center;  font-size:20px; font-weight:700">
    //                 قائمة الاصناف بعد تحويلها
    //               </h2>
    //             </div>
    //           `);

    //   // Table
    //   printWindow.document.write(`
    //             <div class="table-container">
    //               <table border="1" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
    //                 <thead>
    //                   <tr>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكود</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاسم</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الوحدة</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الكمية</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">سعر الوحدة</th>
    //                     <th style="padding: 8px; font-size: 24px; font-weight: 800;">الاجمالي</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //           `);

    //   // Populate rows and calculate totals
    //   let totalUnitPrice = 0;

    //   foundInvoice?.invoicesData2.forEach(row => {
    //     const rowTotal = row.unitPrice * row.totalQuantity;
    //     totalUnitPrice += rowTotal;

    //     printWindow.document.write(`
    //               <tr>
    //                 <td style="min-width: 200px; padding: 5px;">${row.code}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.name}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.unit}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.totalQuantity}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${row.unitPrice.toFixed(2)}</td>
    //                 <td style="min-width: 200px; padding: 5px;">${rowTotal.toFixed(2)}</td>
    //               </tr>
    //             `);
    //   });

    //   // Close table body
    //   printWindow.document.write(`
    //         </tbody>
    //       </table>
    //     </div>
    //   `);

    //   // Footer with total price
    //   printWindow.document.write(`
    //     <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
    //       <div><h2 style="margin: 0;">إجمالي سعر الأصناف  بعد تحويلها : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
    //     </div>
    //   `);

    // }
    // Close HTML
    printWindow.document.write('</body></html>');

    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.print();
  };



  const loggedUser = JSON.parse(localStorage.getItem('user'));


  const deleteInvoiceFunction = async () => {
    try {
      let data = {
        invoiceCode: foundInvoice?.invoiceCode
      }
      // deleteInvoice
      setIsLoading(true);
      let result = await window?.electron?.deleteInvoice(data);
      setIsLoading(false);

      if (result?.success) {
        setShowDeleteModal(false);
        setFoundInvoice(null);
        return toast.success('تم حذف الفاتورة بنجاح');
      }

    } catch (error) {
      console.log('error', error?.message);
      setIsLoading(false);
      return toast.error('فشل في عملية الحذف');

    }
  }




  console.log('foundInvoice', foundInvoice);
  return (
    <div className='w-75 h-100'>
      <div className="d-flex justify-content-between">
        <h1> طباعة فاتورة   {isLoading && <Spinner />}  </h1>

        <div>

          <button style={{
            marginTop:'10px'
          }} onClick={() => { window?.history?.back() }} className='btn btn-primary' > رجوع  </button>
        </div>
      </div>
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
            onClick={() => {
              if(foundInvoice?.type == 'convert')
              {
                handlePrintConvertInvoice()
              } else{
                handlePrint();
              }
              }}
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





