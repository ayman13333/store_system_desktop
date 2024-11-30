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
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const amPm = hours >= 12 ? 'مساءََ' : 'صباحاََ';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)
  
    const timePart = `${hours}:${minutes}:${seconds} ${amPm}`;
  
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
    if (tableData.length === 0) {
      return toast.warning('لا يوجد بيانات للطباعة');

    }
    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>تقرير الجرد</title><style>');
    
    // Define the print media query and apply RTL styles
    printWindow.document.write('@media print {');
    printWindow.document.write('body { font-family: Arial, sans-serif; font-size: 12px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; direction: rtl; }'); // Set table to RTL
    printWindow.document.write('th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }'); // Set text alignment to right for RTL
    printWindow.document.write('@page { direction: rtl; }'); // Ensure the page itself is in RTL for printing
    printWindow.document.write('}');
    
    printWindow.document.write('</style></head><body>');
    
    // Print the table data with RTL column order
    printWindow.document.write('<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">');
    printWindow.document.write(`<div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>`);
    printWindow.document.write(`<div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>`);
    printWindow.document.write('</div>');
  
    printWindow.document.write('<div><h2 style="text-align: center;">تقرير الجرد</h2></div>');
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="1" style="width:100%; border-collapse: collapse; direction: rtl;">');
    
    // Define the column headers in RTL order (columns order adjusted here)
    printWindow.document.write('<thead><tr><th>الكود</th><th>الاسم</th><th>الوحدة</th><th>الكمية</th></tr></thead><tbody>');
    
    // Populate the rows with the reversed order of columns (values adjusted for RTL)
    tableData.forEach(row => {
      printWindow.document.write(`
        <tr>
        <td>${row.code}</td>
        <td>${row.name}</td>
        <td>${row.unit}</td>
        <td>${row.totalQuantity}</td>

        </tr>
      `);
    });
  
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</div>');
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
