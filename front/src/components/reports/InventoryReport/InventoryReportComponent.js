import React, { useState, useEffect } from 'react';
import ReactSelect from '../../../Utilities/ReactSelect'; // Adjust the path as needed
import DataTable from "react-data-table-component";
import { toast } from 'react-toastify';
import logo from '../InventoryReportWithoutPrice/logo.jpeg'
export default function InventoryReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [secondSelectValue, setSecondSelectValue] = useState(null); 
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (selectedValue === null) {
      setSelectedValue(null);
      setSecondSelectValue(null);
    }
  }, [selectedValue]);


  const dynamicData = categories.map(category => ({
    code: category?.code,
    name: category?.name,
    unit: category?.unit,
    totalQuantity: category?.totalQuantity,
    unitPrice: category?.unitPrice,
  }));

  // Calculate the sum of all unitPrice
  const totalUnitPrice = parseFloat(categories.reduce((sum, category) => {
    return sum + ((category?.unitPrice * category?.totalQuantity) || 0);
  }, 0).toFixed(2));

  console.log("dynamicData",dynamicData)

  const getCurrentDate = () => {
    const now = new Date();
  
    const datePart = {
      day: String(now.getDate()).padStart(2, '0'), 
      month: String(now.getMonth() + 1).padStart(2, '0'),
      year: now.getFullYear(),
    };
  
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'مساءََ' : 'صباحاََ';
    hours = hours % 12 || 12; 
    const timePart = `${hours}:${minutes} ${amPm}`;
  
    return { datePart, timePart };
  };
  
  const { datePart, timePart } = getCurrentDate();

  useEffect(() => {
    const get = async () => {
      const [result] = await Promise.all([
        window?.electron?.getAllCategories()
      ]);
      setCategories(result?.categories);
      setTableData(result?.categories); 
    }

    get();
  }, []);

  console.log("categories",categories)

  // "supplier"
  // "consumer"
  // "transfer"

  const columns = [
    {
      name: 'م', 
      minwidth: "50px",
      cell: (row, index) => (
        <div style={{ textAlign: 'center', width: '100%' , maxWidth:"50px" }}>
          {index + 1} {/* Display index starting from 1 */}
        </div>
      ),
    },
    {
      name: 'الكود',
      minWidth: '180px',
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
      minwidth: '180px',
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
      minwidth: '180px',
      selector: row => row.unit,
      sortable: true,
    },
    {
      name: 'الكمية',
      minwidth: '180px',
      selector: row => row.totalQuantity,
      sortable: true,
    },
    {
      name: 'سعر الوحدة',
      minwidth: '180px',
      selector: row => row.unitPrice.toFixed(2),
      sortable: true,
    },
    {
      name: 'الاجمالي',
      minwidth: '180px',
      selector: (row) => (row.unitPrice * row.totalQuantity).toFixed(2),
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
    if ( tableData.length == 0) {
      return toast.warning('لا يوجد بيانات للطباعة');
    }
  
    const printWindow = window.open('', '', 'height=800,width=1200');
    
    // Start writing the HTML content
    printWindow.document.write('<html><head><title>تقرير الجرد</title><style>');
  
    // CSS for printing
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
  

          printWindow.document.write(`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
              <img src=${logo} alt="Logo" style="max-width: 70px; height: 70px;">
              <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 28px; font-weight: 900; margin-left: 20px; text-decoration: underline;">
                <div style=" font-weight: 900;">دار ضباط الحرب الكيميائية</div>
                <div style=" font-weight: 900;">جاردينيا</div>
              </div>
            </div>
          `);
  
          printWindow.document.write(`
            <main style="  margin: 10px; 
            padding: 20px;
            border: 5px solid black;
            box-sizing: border-box; ">
   `);
    // Title
    printWindow.document.write(`
      <div>
        <h2 style="text-align: center; text-decoration: underline; text-underline-offset: 7px; font-size:32px; font-weight:800">
            تقرير جرد مخزن التغذية والمشروبات ( مسعر )
        </h2>
      </div>
    `);
  
    // Table
    printWindow.document.write(`
      <div class="table-container">
        <table border="5" style="width:100%;  table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center;">
          <thead style="border-bottom: 5px solid black;">
            <tr>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 5%; ">م</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 10%;">الكود</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 30%;">الصنف</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 10%;">الوحدة</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 10%;">الكمية</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 15%;">سعر الوحدة</th>
              <th style="padding: 5px; font-size: 24px; font-weight: 800; border-right: 5px solid black; width: 15%;">الاجمالي</th>
            </tr>
          </thead>
          <tbody>
    `);
  
    // Populate rows and calculate totals
    let totalUnitPrice = 0;
  
    tableData.forEach((row, index) => {
      const rowTotal = row.unitPrice * row.totalQuantity;
      totalUnitPrice += rowTotal;
  
      printWindow.document.write(`
        <tr style="border-bottom: 2px solid black;">
          <td style="min-width: 40px;  padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${index+1}</td>
          <td style="min-width: 60px;  padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${row.code}</td>
          <td style="min-width: 200px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${row.name}</td>
          <td style="min-width: 70px;  padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${row.unit}</td>
          <td style="min-width: 80px;  padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${row.totalQuantity}</td>
          <td style="min-width: 80px;  padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${row.unitPrice.toFixed(2)}</td>
          <td style="min-width: 100px; padding: 5px; font-size: 20px; font-weight: 600; border-right: 5px solid black; word-wrap: break-word;">${rowTotal.toFixed(2)}</td>
        </tr>
      `);
    });
  
    // Close table body
    printWindow.document.write(`
          </main>
          </tbody>
        </table>
      </div>
    `);
  
    // Footer with total price
    printWindow.document.write(`
      <div style="display: flex; justify-content: center; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-top: 20px;">
        <div><h2 style="margin: 0;">إجمالي سعر الأصناف بالمخزن : ${totalUnitPrice.toFixed(2)} جنيه</h2></div>
      </div>
    `);
  
    // Close HTML
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
        <h1>تقرير جرد مخزن التغذية والمشروبات ( مسعر )</h1>
  
        <br />
      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* <ReactSelect
          options={Staticoptions}
          value={selectedValue}
          onChange={setSelectedValue}
          placeholder="اختر"
          width="250px"
        />
        <ReactSelect
          options={dynamicOptions}
          value={secondSelectValue}
          onChange={setSecondSelectValue}
          placeholder="اختر"
          width="350px"
        /> */}
        {/* <button onClick={search} className="btn btn-success">بحث</button> */}
        {/* <button onClick={cancelSearch} className="btn btn-danger">إلغاء البحث</button> */}

      </div>
      <br />

      {/* Print Button */}
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
      <div style={{
  display: "flex",
  justifyContent: "flex-start",
  gap: "20px",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
}}>
  <div style={{
    color: "#333",
    fontWeight: "900",
    fontSize: "22px"
  }}>
    إجمالي سعر الأصناف بالمخزن :
  </div>
  <div style={{
    fontSize: "22px",
    fontWeight: "900",
    color: "#333"
  }}>
    <span>{totalUnitPrice}</span>
    <span> </span>
    <span>جنيه </span>
  </div>
</div>

    </div>
  );
}
