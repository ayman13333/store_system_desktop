import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import logo from "./logo.jpeg";

export default function InventoryReportWithoutPriceComponent() {
  const [tableData, setTableData] = useState([]); // Data to be displayed in the table
  const [categories, setCategories] = useState([]);


  const dynamicData = categories.map(category => ({
    code: category?.code,
    name: category?.name,
    unit: category?.unit,
    totalQuantity: category?.totalQuantity,
  }));


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


  useEffect(() => {
    const get = async () => {
      const [result] = await Promise.all([
        window?.electron?.getAllCategories()
      ]);

      // console.log('categories', categories);
      console.log('result', result);

      setCategories(result?.categories);

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
          {index + 1} {/* Display index starting from 1 */}
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
          margin: 0;
          padding: 0;
        }
        @page { 
          size: A4; /* Set page size to A4 */
          margin: 20mm; /* Optional margin for A4 */
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
          font-weight: bold; /* Make the table header bold */
        }
        td {
          font-weight: normal;
        }
        table, th, td {
          border: 5px solid black; /* Set the outer border to 5px */
        }
        @page {
          direction: rtl;
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

    printWindow.document.write(`
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
        <img src=${logo} alt="Logo" style="max-width: 70px; height: 70px;">
        <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 28px; font-weight: 900; margin-left: 20px; text-decoration: underline;">
          <div style=" font-weight: 900;">دار ضباط الحرب الكيميائية</div>
          <div style=" font-weight: 900;">جاردينيا</div>
        </div>
      </div>
    `);
    
  
    // Title
    printWindow.document.write(`
      <div>
        <h2 style="text-align: center; text-decoration: underline; text-underline-offset: 7px; font-size:32px; font-weight:800">
          تقرير جرد مخزن التغذية والمشروبات
        </h2>
      </div>
    `);
  
    // Table
    printWindow.document.write(`
      <div class="table-container">
        <table border="5" style="width:100%; border-collapse: collapse; direction: rtl; text-align: center;">
          <thead style="border-bottom: 5px solid black;">
            <tr>
              <th style="padding: 8px; font-size: 24px; font-weight: 800;  border-right: 5px solid black;">م</th>
              <th style="padding: 8px; font-size: 24px; font-weight: 800;  border-right: 5px solid black;">الكود</th>
              <th style="padding: 8px; font-size: 24px; font-weight: 800;  border-right: 5px solid black;">الصنف</th>
              <th style="padding: 8px; font-size: 24px; font-weight: 800;  border-right: 5px solid black;">الوحدة</th>
              <th style="padding: 8px; font-size: 24px; font-weight: 800;  border-right: 5px solid black;">الكمية</th>
            </tr>
          </thead>
          <tbody>
    `);
  
    // Populate rows
    tableData.forEach((row, index) => {
      printWindow.document.write(`
        <tr style="border-bottom: 2px solid black;">
          <td style="min-width: 50px;  padding: 5px; font-size: 20px; font-weight: 600;  border-right: 5px solid black;">${index+1}</td>
          <td style="min-width: 100px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.code}</td>
          <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.name}</td>
          <td style="min-width: 100px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.unit}</td>
          <td style="min-width: 100px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black;">${row.totalQuantity}</td>
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

<h1> تقرير جرد مخزن التغذية والمشروبات</h1>

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
