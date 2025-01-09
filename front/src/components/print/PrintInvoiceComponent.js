import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";
import SupplyInvoiceComponent from "../invoices/supplyInvoice/SupplyInvoiceComponent";
import PaymentInvoiceComponent from "../invoices/paymentInvoice/PaymentInvoiceComponent";
import ConvetInvoiceComponent from "../invoices/ConvetInvoice/ConvetInvoiceComponent";

import { useLocation, useNavigate } from "react-router-dom";
import ConfirmEditModal from "../items/ConfirmEditModal";
import { toast } from "react-toastify";
import logo from '../reports/InventoryReportWithoutPrice/logo.jpg'
import { MyContext } from "../..";
import EditInvoiceModal from "./EditInvoiceModal";

export default function PrintInvoiceComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setEntities } = useContext(MyContext);

  // console.log('entities',entities);

  useEffect(()=>{
    return()=>setEntities(null);
  },[]);

  const [isLoading, setIsLoading] = useState(() => false);
  const [foundInvoice, setFoundInvoice] = useState(() => location?.state ? location?.state : null);
  const [showDeleteModal, setShowDeleteModal] = useState(() => false);
  const[showEditModal,setShowEditModal]=useState(false);

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

    return `${day}/${month}/${year}`;
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
              margin: 5mm; 
              direction: rtl; 
          size: A4 portrait ; 

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

    // printWindow.document.write(`
    //           <main style="; 
    //           padding: 20px;
    //           height:90vh;
    //           border: 5px solid black;
    //           box-sizing: border-box; ">
    //  `);
    printWindow.document.write(`
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;     direction: rtl;">
      <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
      ">
      <div>دار ضباط الحرب الكيميائية</div>
      <div>جاردينيا</div>
<div  style="display: flex; justify-content:center; align-items: center;">
<div style="font-weight: 500; font-size: 14px;">  تاريخ التسجيل </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; ">${formatDate(foundInvoice?.registerDate)}</div>
</div>
<div  style="display: flex; justify-content:center; align-items: center;">
<div style="font-weight: 500; font-size: 14px;">  كود  </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; "> ( ${foundInvoice?.invoiceCode} ) </div>
</div>

      </div>
      
      <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
        ">
        <img src=${logo} alt="Logo" style="width: 130px; height: 90px; ">
      </div>
      </div>
    `);

    // Title
    if (foundInvoice?.type === "supply") {
      printWindow.document.write(`
        <div style="text-underline-offset: 7px; margin:20px 0 0 0 ">
          <!-- First line: Invoice number and date -->
          <div style="display: flex; margin-bottom:10px; justify-content: center; align-items: center; font-weight: 900; font-size: 20px; direction: rtl; font-family: cairo;">
            <span >  مستند إضافة رقم </span> <span style="color:#fff">..</span> <span style="font-weight: 500;">( ${foundInvoice?.serialNumber} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span style="font-weight: 500;">${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
          
          
          <!-- Second line: Supplier name -->
          <div style="display: flex; margin-bottom:10px; justify-content: center; align-items: center; font-weight: bold; font-size: 18px; direction: rtl;  text-decoration: underline;  text-decoration-thickness: 2px; font-family: cairo;">
            <span>الاصناف الواردة بيد </span> <span style="color:#fff">..</span><span style="font-weight: 500;"> ( ${foundInvoice?.supplierID?.fullName} ) </span>
          </div>

          
        </div>
      `);
    }
    if (foundInvoice?.type === "payment") {
      printWindow.document.write(`
        <div style="text-underline-offset: 7px; margin:20px 0 0 0 ">
          <!-- First line: Invoice code and date -->
          <div style="display: flex; margin-bottom:10px; justify-content: center; align-items: center; font-weight: 900; font-size: 20px; direction: rtl; font-family: cairo;">
            <span > طلب صرف اصناف من مخزن الأغذية و المشروبات رقم   </span> <span style="margin: 0 2px;"> </span><span style="font-weight: 500;"> ( ${foundInvoice?.serialNumber} )</span>
          </div>
          <div style="display: flex; margin-bottom:10px; justify-content: center; align-items: center; font-weight: bold; font-size: 18px; direction: rtl; text-decoration: underline;  text-decoration-thickness: 2px; font-family: cairo;">
            <span > إلي قسم </span> <span style="color:#fff">..</span> <span style="font-weight: 500;">( ${foundInvoice?.supplierID?.fullName} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span style="font-weight: 500;">${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
          
          
          <!-- Second line: Supplier name -->

        </div>
      `);
    }
    // Table
    if (foundInvoice?.type === "supply") {
      printWindow.document.write(`

              <table border="5" style="width:100%; table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center; margin-top:30px">
                        <div class="table-container">
               <div >
            </div>
  
        <thead style="border-bottom: 5px solid black; background:#e9ecef;">
                  <tr>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 3%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
      م
      </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                الكود
                </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 29%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                الصنف
                </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                الوحدة
                </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 8%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                الكمية
                </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                السعر
                </div></th>
      <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 15%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                    إجمالي
                    </div></th>
                  </tr>
                </thead>
                <tbody>
          `);
    }



    // Table
    if (foundInvoice?.type === "payment") {
      printWindow.document.write(`
    
              <table border="5" style="width:100%; table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center; margin-top:30px">
                            <div class="table-container">
                   <div >
                </div>
      
            <thead style="border-bottom: 5px solid black; background:#e9ecef;">
                      <tr>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 5%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                م </div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 20%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                      الكود </div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 30%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">

      الصنف </div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 15%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                      الوحدة </div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 15%;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">
                      الكمية </div></th>
                      </tr>
                    </thead>
                    `);
    }
    // Populate rows and calculate totals
    let totalUnitPrice = 0;

    foundInvoice?.invoicesData.forEach((row, index) => {
      const rowTotal = row.unitPrice * row.totalQuantity;
      totalUnitPrice += rowTotal;
      if (foundInvoice?.type === "supply") {
        let totalPrice = row.unitPrice * row.totalQuantity;






        printWindow.document.write(`
        <tbody style="border-bottom: 2px solid black;">
          <tr style="padding:5px; border-right: 2px solid black;">
                <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${index + 1}
                </div>
                </td>
                <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${row.code}
                </div></td>
                <td style="min-width: 200px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${row.name}
                </div>
                </td>
                <td style="min-width: 200px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${row.unit}
                </div></td>
                <td style="min-width: 200px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${row.totalQuantity}
                </div></td>
                <td style="min-width: 200px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${row.unitPrice.toFixed(2)}</div></td>
                <td style="min-width: 200px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">
                ${totalPrice.toFixed(2)}
                </div></td>
                </tr>
                
              
              
            `);
      }
      if (foundInvoice?.type === "payment") {
        printWindow.document.write(`
   <tbody style="border-bottom: 2px solid black;">
          <tr style="padding:5px; border-right: 2px solid black;">
<td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">${index + 1}</div>
                          </td>
<td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">${row.code}</div>
                          </td>
<td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">${row.name}</div>
                          </td>
<td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">${row.unit}</div>
                          </td>
<td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
                          <div style=" display:flex; justify-content: center; align-items: center;   ">${row.totalQuantity}</div>
                          </td>

                </tr>
                
              
              
            `);
      }

    });

    if (foundInvoice?.type == 'payment') {
      printWindow.document.write(`

          <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; ">
          <td colspan="2" style="padding: 5px; border-right: 5px solid black; font-size: 16px;">
          <div style=" display:flex; justify-content: center; align-items: center;   ">
          ملاحظات
          </div>
          </td>
          <td colspan="3" style="padding: 5px; border-right: 5px solid black; font-size: 14px;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${foundInvoice?.notes}
          </div>
          </td>

        </tr>
      `);
    }

    if (foundInvoice?.type == 'supply') {
      printWindow.document.write(`
        <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; ">
          <td colspan="2" style="padding: 5px; border-right: 5px solid black; font-size: 16px;">
          <div style=" display:flex; justify-content: center; align-items: center;   ">
          ملاحظات
          </div>
          </td>
          <td colspan="5" style="padding: 5px; border-right: 5px solid black; font-size: 14px;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${foundInvoice?.notes}
          </div>
          </td>

        </tr>
      <tr style="font-weight: 700; padding: 5px; border-top: 2px solid black; text-align: center;">
          <td colspan="2" style="padding: 5px; border-right: 5px solid black; font-size: 16px;">
                    <div style=" display:flex; justify-content: center; align-items: center;   ">
          <span> إجمالي الفاتورة    </span>
          </div>
          <td colspan="5" style="padding: 5px; border-right: 5px solid black; font-size: 16px;">
                    <div style=" display:flex; justify-content: center; align-items: center;   ">
  
          <span style="margin: 0 5px;"> ${totalUnitPrice.toFixed(2)} </span>
          <span>جنيه</span>
          </div>
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

    if (foundInvoice?.type === "supply") {
      printWindow.document.write(`
      <div style="font-size:18px; font-weight:900; direction: rtl; margin:20px 10px 0 0;">           
        <div>نشهد بأن الأصناف عالية وردت تمام واضيفت علي عهدة المخزن وهذه شهادة منا بذلك،،،</div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
         <div>التوقيع <span style="font-size:10px; font-weight:400;">.....................</span></div>
         <div>التوقيع <span style="font-size:10px; font-weight:400;">.....................</span></div>
         <div>التوقيع <span style="font-size:10px; font-weight:400;">.....................</span></div>
         <div>التوقيع <span style="font-size:10px; font-weight:400;">.....................</span></div>
        </div>
         
          <div style="display: flex; justify-content: space-between; margin: 5px 10px 0 0;">
          <div>أمين عهدة المخزن</div>
          <div>رئيس القسم المختص</div>
          <div>مراقب العهدة</div>
          <div>رئيس قسم المشتريات</div>
        </div>
      </div>
    `);
    }
    if (foundInvoice?.type === "payment") {
      printWindow.document.write(`
      <div style="font-size:18px; font-weight:700; direction: rtl; margin:50px 10px 0 0;">           
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <div  style="display: flex; justify-content:center; width:25%;">التوقيع </div>
          <div  style="display: flex; justify-content:center; width:25%;">التوقيع </div>
          <div  style="display: flex; justify-content:center; width:25%;">التوقيع </div>
          <div  style="display: flex; justify-content:center; width:25%;">التوقيع </div>
        </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size:16px;">
          <div  style="display: flex; justify-content:center; width:25%;" >أمين العهدة</div>
          <div  style="display: flex; justify-content:center; width:25%;" >المستلم</div>
          <div  style="display: flex; justify-content:center; width:25%;">رئيس قسم المشتريات</div>
          <div  style="display: flex; justify-content:center; width:25%;"> مدير الأغذية و المشروبات</div>
        </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <div  style="display: flex; justify-content:center; width:25%; font-size:10px" >................................</div>
          <div  style="display: flex; justify-content:center; width:25%; font-size:10px" >................................</div>
          <div  style="display: flex; justify-content:center; width:25%; font-size:10px" >................................</div>
          <div  style="display: flex; justify-content:center; width:25%; font-size:10px" >................................</div>
        </div>
      </div>
    `);
    }
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

    let convertInvoiceObj = {
      ...foundInvoice,
      invoicesData: [
        ...foundInvoice?.invoicesData,
        ...foundInvoice?.invoicesData2
      ]


    };
    console.log('mergedArray', mergedArray);

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
          margin: 5mm; 
          direction: rtl; 
      size: A4 portrait ; 

        }
      }
    `);

    printWindow.document.write('</style></head><body>');


    printWindow.document.write(`
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;     direction: rtl;">
      <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
      ">
      <div>دار ضباط الحرب الكيميائية</div>
      <div>جاردينيا</div>
<div  style="display: flex; justify-content:center; align-items: center;">
<div style="font-weight: 500; font-size: 14px;">  تاريخ التسجيل </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; ">${formatDate(foundInvoice?.registerDate)}</div>
</div>
<div  style="display: flex; justify-content:center; align-items: center;">
<div style="font-weight: 500; font-size: 14px;">  كود  </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; "> ( ${foundInvoice?.invoiceCode} ) </div>
</div>

      </div>
      
      <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
        ">
        <img src=${logo} alt="Logo" style="width: 130px; height: 90px; ">
      </div>
      </div>
    `);

    // <div style="display: flex; justify-content: center;  margin-bottom:30px; align-items: center; font-weight: 500; font-weight: bold; font-size: 18px; direction: rtl; font-family: cairo; margin:0 0 10px 0">
    //         <span style="font-weight: 500;"> كود فاتورة  </span> <span style="color:#fff">..</span> <span style:"font-weight: 500;">( ${foundInvoice?.invoiceCode} )</span ><span style="color:#fff">..</span>
    //         <span style="font-weight: 500;">  بتاريخ تسجيل </span> <span style="color:#fff">..</span> <span style:"font-weight: 500;">${formatDate(foundInvoice?.registerDate)}</span>
    //       </div>

    if (foundInvoice?.type === "convert") {
      printWindow.document.write(`
        <div style="text-underline-offset: 7px; margin:20px 0 30px 0; ">
          <div style="display: flex; margin-bottom:10px; justify-content: center; align-items: center; font-weight: 900; font-size: 20px; direction: rtl; text-decoration: underline;  text-decoration-thickness: 2px; font-family: cairo;">
            <span > أورنيك تحويل رقم </span> <span style="color:#fff">..</span> <span style:"font-weight: 500;">( ${foundInvoice?.serialNumber} )</span ><span style="color:#fff">..</span>
            <span > بتاريخ </span> <span style="color:#fff">..</span> <span style:"font-weight: 500;">${formatDate(foundInvoice?.supplyDate)}</span>
          </div>
      
          
        </div>
      `);
    }





    printWindow.document.write(`
  
  
  
              <table border="5" style="width:100%; table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center; margin-top:30px">
                        <div class="table-container">
               <div >
            </div>
  
        <thead style="border-bottom: 5px solid black;">
                  <tr>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%; background:#e9ecef;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">م </div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 20%; background:#e9ecef;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">الصنف قبل التحويل</div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%; background:#e9ecef;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">الوحدة</div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%; background:#e9ecef;">
                <div style=" display:flex; justify-content: center; align-items: center;   ">الكمية</div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 20%;">
                <div style=" display:flex; justify-content: center; align-items: center; ">الصنف بعد التحويل</div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center;    "> الوحدة</div></th>
   <th style="padding: 8px; font-size: 16px; font-weight: 800; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center;   "> الكمية</div></th>
                  </tr>
                </thead>
          `);

    // Populate rows and calculate totals
    let totalUnitPrice = 0;
    let totalUnitPrice2 = 0;

    mergedArray.forEach((row, index) => {
      if (row.unitPrice) {
        const rowTotal = row.unitPrice * row.totalQuantity;
        totalUnitPrice += rowTotal;
      }
      if (row.unitPrice2) {
        const rowTotal2 = row.unitPrice2 * row.totalQuantity2;
        totalUnitPrice2 += rowTotal2;
      }
      printWindow.document.write(`
<tbody style="border-bottom: 2px solid black;">
<tr style="padding:5px; border-right: 2px solid black;">
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef;">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${index + 1}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef;">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.name ? row.name : ""}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef;">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.unit ? row.unit : ""}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef;">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.totalQuantity ? row.totalQuantity : ""}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; ">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.name2 ? row.name2 : ""}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;  ">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.unit2 ? row.unit2 : ""}</div></td>
           <td style="min-width: 80px; padding: 5px; font-size:14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;  ">
                          <div style=" display:flex; justify-content: center; align-items: center;   "> ${row.totalQuantity2 ? row.totalQuantity2 : ""}</div></td>





                </tr>
                
              
              
            `);


    });
    printWindow.document.write(`

            <tr style="font-weight: 900; padding: 5px; border-top: 2px solid black; ">
          <td colspan="2" style="padding: 5px; border-right: 5px solid black; font-size: 16px;">
          <div style=" display:flex; justify-content: center; align-items: center;   ">
          ملاحظات
          </div>
          </td>
          <td colspan="5" style="padding: 5px; border-right: 5px solid black; font-size: 14px;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${foundInvoice?.notes}
          </div>
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
          <div style="display: flex; justify-content: space-between; direction: rtl; margin:50px 0 0 0 ;">
        
            <!-- First column: أمين العهدة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 18px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>أمين العهدة</span>
            </div>
        
            <!-- Second column: مراقب الجودة -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 18px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>مراقب العهدة</span>
            </div>
        
            <!-- Third column: رئيس القسم المختص -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 18px; direction: rtl; margin: 10px;">
              <span>التوقيع /</span>
              <span>رئيس القسم المختص</span>
            </div>
        
            <!-- Fourth column: مديـر الــدار -->
            <div style="display: flex; flex-direction: column; justify-content: start; align-items: center; font-weight: bold; font-size: 18px; direction: rtl; margin: 10px;">
             <div style="margin:0 0 0 40px">
             <span> يعتمد، </span>
             </div>
             <div style="margin:0 0 0 40px">
             <span>مديـر الــدار</span>
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
        <h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"242px" }}> طباعة فاتورة   {isLoading && <Spinner />}  </h1>

        <div>

          <button style={{
            marginTop: '10px'
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
          <div className="d-flex gap-5">
          <button
            onClick={() => {
              if (foundInvoice?.type == 'convert') {
                handlePrintConvertInvoice()
              } else {
                handlePrint();
              }
            }}
            disabled={isLoading}
            className='btn btn-primary'> طباعة </button>

            <button 
            className="btn btn-warning"
            onClick={()=>setShowEditModal(true)}
            > 
              تعديل
            </button>
          </div>
         <div>
         {
            loggedUser?.type == "admin" &&
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger">
              حذف
            </button>
          }
         </div>
         

        </div>
      }

      {
        showDeleteModal && <ConfirmEditModal
          func={deleteInvoiceFunction}
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          type={'delete'} />
      }

      {
        showEditModal&&<EditInvoiceModal 
        show={showEditModal}
        setShow={setShowEditModal}
        foundInvoice={foundInvoice}
        setFoundInvoice={setFoundInvoice}
         />
      }
    </div>
  )
}





