import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import logo from "./logo.jpg";

export default function InventoryReportWithoutPriceComponent() {
  const [tableData, setTableData] = useState([]); // Data to be displayed in the table



  // const getCurrentDate = () => {
  //   const now = new Date();
  
  //   // First variable: day, month, and year
  //   const datePart = {
  //     day: String(now.getDate()).padStart(2, '0'), // Add leading zero if needed
  //     month: String(now.getMonth() + 1).padStart(2, '0'), // Months are zero-based
  //     year: now.getFullYear(),
  //   };
  
  //   // Second variable: time with AM/PM
  //   let hours = now.getHours();
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const amPm = hours >= 12 ? 'مساءََ' : 'صباحاََ';
  //   hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)
  
  //   const timePart = `${hours}:${minutes} ${amPm}`;
  
  //   return { datePart, timePart };
  // };
  
  // Store the values in variables
  // const { datePart, timePart } = getCurrentDate();


  useEffect(() => {
    const get = async () => {
      const [result] = await Promise.all([
        window?.electron?.getAllCategories()
      ]);

      // console.log('categories', categories);
      console.log('result', result);


      setTableData(result?.categories);  // Set dynamic data to tableData

    }

    get();
  }, []);


  const columns = [
    {
      name: 'م', // Row index column
      minwidth: "50px",
      cell: (row, index) => (
        <div style={{ textAlign: 'center', width: '100%' , maxWidth:"50px" }}>
          {row?.serialNumber} {/* Display index starting from 1 */}
        </div>
      ),
    },
    {
      name: 'الكود',
      minwidth:"180px",
      sortable: true,
      cell: row => {
        let codeStr = row?.code?.length > 10 ? row.code.substring(0, 10) + '...' : row.code;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {codeStr}
          </div>
        );
      }
    },
    {
      name: 'الصنف',
      minwidth:"180px",
      sortable: true,
      cell: row => {
        let nameStr = row?.name?.length > 10 ? row.name.substring(0, 10) + '...' : row?.name;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {nameStr}
          </div>
        );
      }
    },
    {
      name: 'الوحدة',
      minwidth:"180px",
      selector: row => row.unit,
      sortable: true,
    },
    {
      name: 'الكمية',
      minwidth:"180px",
      selector: row => row.totalQuantity,
      sortable: true,
    },
   
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: '900',
        fontSize: '20px',
        alignItems: "center",
        justifyContent: 'center',
        textAlign: 'center',
        borderTop: '2px solid black', // Border for table cells
        borderBottom: '2px solid black', // Border for table cells
        borderRight: '2px solid black', // Border for table cells
        borderLeft: '2px solid black',  // Border for table cells
        width: "100%",
        backgroundColor:'#e9ecef',
      },
    },
    cells: {
      style: {
        whiteSpace: 'normal',
        fontSize: '16px',
        fontWeight: '700',
        overflow: 'visible',
        userSelect: 'text',
        alignItems: "center",
        justifyContent: 'center',
        textAlign: 'center',
        borderRight: '2px solid black', // Border for table cells
        borderLeft: '2px solid black',  // Border for table cells
        borderBottom: '1px solid black',
        width: "100%",
      },
    },
    rows: {
      style: {
        '&:last-child': {
          borderBottom: '2px solid black', // Border for the last row
        }
      }
    }
  };


 
  // Function to handle the print action
  const printReport = () => {
    if (!tableData || tableData.length === 0) {
      return toast.warning('لا يوجد بيانات للطباعة');
    }
  
    const printWindow = window.open('', '', 'height=800,width=1200');
  
    printWindow.document.write('<html><head><title>تقرير الجرد</title><style>');
  
    // Print styles
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
  
    // Add header information
    // printWindow.document.write(`
    //   <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
    //     <div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>
    //     <div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>
    //   </div>
    // `);

       const today = new Date();
   
       const formatDate = (dateString) => {
         const date = new Date(dateString);
         const day = String(date.getDate()).padStart(2, '0');
         const month = String(date.getMonth() + 1).padStart(2, '0');
         const year = date.getFullYear();
     
         return `${day}/${month}/${year}`;
       };
       
                printWindow.document.write(`
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;     direction: rtl;">
                  <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
                  ">
                  <div>دار ضباط الحرب الكيميائية</div>
                  <div>جاردينيا</div>
            <div  style="display: flex; justify-content:center; align-items: center;">
            <div style="font-weight: 500; font-size: 14px;">  تاريخ الجرد </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; ">${formatDate(today)}</div>
            </div>
           
            
                  </div>
                  
                  <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
                    ">
                    <img src=${logo} alt="Logo" style="width: 130px; height: 90px; ">
                  </div>
                  </div>
                `);
    
  
    // Title
    printWindow.document.write(`
     <div style="margin:0 0 30px 0">
        <h2 style="text-align: center; text-decoration: underline; text-underline-offset: 7px; font-size:18px; font-weight:800">
          تقرير جرد مخزن الأغذية و المشروبات
        </h2>
      </div>
    `);
  
    // Table
    printWindow.document.write(`
      <div class="table-container">
        <table border="5" style="width:100%;  table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center;">
          <thead style="border-bottom: 5px solid black; background:#e9ecef;">
            <tr>
              <th style="padding: 8px; font-size: 16px; font-weight: 700;  border-right: 5px solid black; width: 5%;">
              <div style=" display:flex; justify-content: center; align-items: center; ">م</div></th>
              <th style="padding: 8px; font-size: 16px; font-weight: 700;  border-right: 5px solid black; width: 15%;">
              <div style=" display:flex; justify-content: center; align-items: center; ">الكود</div></th>
              <th style="padding: 8px; font-size: 16px; font-weight: 700;  border-right: 5px solid black; width: 40%;">
              <div style=" display:flex; justify-content: center; align-items: center; ">الصنف</div></th>
              <th style="padding: 8px; font-size: 16px; font-weight: 700;  border-right: 5px solid black; width: 20%;">
              <div style=" display:flex; justify-content: center; align-items: center; ">الوحدة</div></th>
              <th style="padding: 8px; font-size: 16px; font-weight: 700;  border-right: 5px solid black; width: 20%;">
              <div style=" display:flex; justify-content: center; align-items: center; ">الكمية</div></th>
            </tr>
          </thead>
          <tbody>
    `);
  
    // Populate rows
    tableData.forEach((row, index) => {
      printWindow.document.write(`
        <tr style="border-bottom: 2px solid black;">
          <td style="min-width: 50px;  padding: 5px; font-size: 14px; font-weight: 500;  border-right: 5px solid black; word-wrap: break-word; word-break: break-all; background:#e9ecef;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row?.serialNumber}</div></td>
          <td style="min-width: 100px; padding: 5px; font-size: 14px; font-weight: 500;  border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row.code}</div></td>
          <td style="min-width: 200px; padding: 5px; font-size: 14px; font-weight: 500;  border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row.name}</div></td>
          <td style="min-width: 100px; padding: 5px; font-size: 14px; font-weight: 500;  border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row.unit}</div></td>
          <td style="min-width: 100px; padding: 5px; font-size: 14px; font-weight: 500;  border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row.totalQuantity}</div></td>
        </tr>
      `);
    });
  
    // Close table and body
    printWindow.document.write(`
          </tbody>
        </table>
      </div>
    `);
  
    printWindow.document.write('</body></html>');
  
    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.print();
  };
  
  
  
  

  return (
    <div className="h-100">
      {/* <div style={{
        display: "flex",
        justifyContent:"space-between",
alignItems:"center",
padding:"10px",
background:"#f9f9f9",
borderRadius:"8px",
marginBottom:"20px"

      }}>
<div><h4>التاريخ : {datePart.year}-{datePart.month}-{datePart.day}</h4></div>
<div><h4>الوقت : {timePart}</h4></div>
      </div> */}
<div style={{display:"flex", justifyContent:"space-between"}}>
<h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"600px" }} > تقرير جرد مخزن الأغذية و المشروبات</h1>
<img src={logo} alt="Logo" style={{ width: "130px", height: "90px" }} />
</div>



<br />
      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>


      </div>
      <br />

      <button onClick={printReport} className="btn btn-primary">طباعة</button>

      <br />

      {/* Scrollable Table Container */}
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <DataTable
          columns={columns}
          data={tableData} // Display the filtered data
          conditionalRowStyles={[]}
          customStyles={customStyles}
          pagination
        />
      </div>

    </div>
  );
}
