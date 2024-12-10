import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';


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
      name: 'الاسم',
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
        fontWeight: 'bold',
        fontSize: '18px',
        alignItems:"center",
        justifyContent: 'center',
        textAlign: 'center',
      },
    },
    cells: {
      style: {
        whiteSpace: 'normal', 
        fontSize: '16px',
        overflow: 'visible', 
        userSelect: 'text', 
        alignItems:"center",
        justifyContent: 'center',
        textAlign: 'center',
      },
    },
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
        @page { 
          direction: rtl; 
        }
      }
    `);
  
    printWindow.document.write('</style></head><body>');
  
    // Add header information
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
          تقرير الجرد
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
            </tr>
          </thead>
          <tbody>
    `);
  
    // Populate rows
    tableData.forEach(row => {
      printWindow.document.write(`
        <tr>
          <td style="min-width: 200px; padding: 5px;">${row.code}</td>
          <td style="min-width: 200px; padding: 5px;">${row.name}</td>
          <td style="min-width: 200px; padding: 5px;">${row.unit}</td>
          <td style="min-width: 200px; padding: 5px;">${row.totalQuantity}</td>
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
      <div style={{
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
      </div>

<h1>تقرير الجرد</h1>

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
