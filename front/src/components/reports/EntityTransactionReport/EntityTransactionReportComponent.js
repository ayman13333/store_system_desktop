import React, { useState, useEffect } from 'react';
import ReactSelect from '../../../Utilities/ReactSelect'; // Adjust the path as needed
import DataTable from "react-data-table-component"
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';



export default function EntityTransactionReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null); // Track first select value
  const [secondSelectValue, setSecondSelectValue] = useState(null); // Track second select value
  const [startDate, setStartDate] = useState(''); // Track start date
  const [endDate, setEndDate] = useState(''); // Track end date
  const [tableData, setTableData] = useState([]); // Data to be displayed in the table
  const [users, setUsers] = useState([])


  console.log("tableData",tableData)
  useEffect(() => {
    if (selectedValue === null) {
      setSelectedValue(null);
      setSecondSelectValue(null);
    }
  }, [selectedValue]);


  useEffect(() => {
    const get = async () => {
      const result = await window?.electron?.getAllUsers({
        type: 'allSuppliers'
      });

      console.log('result', result);

      setUsers(result?.users);
    }


    get();

  }, []);
  console.log('users', users);


  // "supplier"
  // "consumer"
  // "transfer"

  console.log("selectedValue", selectedValue)
  console.log("secondSelectValue", secondSelectValue)
  const Staticoptions = [
    { value: '1', label: 'اسم المورد' },
    { value: '2', label: 'اسم جهة الصرف' },
    { value: '3', label: 'اسم جهه التحويل' },
  ];

  const options1 = users.filter(user => user.type === "supplier").map(user => ({
    value: user._id,
    label: user.fullName
  }));

  const options2 = users.filter(user => user.type === "consumer").map(user => ({
    value: user._id,
    label: user.fullName
  }));

  const options3 = users.filter(user => user.type === "transfer").map(user => ({
    value: user._id,
    label: user.fullName
  }));


  const dynamicOptions =
    selectedValue === '1' ? options1 :
      selectedValue === '2' ? options2 :
        selectedValue === '3' ? options3 : [];



  const staticData = [
    {
      code: 'A001',
      number: "1",
      type: "صرف",
      name: 'جهة صرف 1',
      invoiceDate: '20-11-2024',
      registrationDate: "20-11-2024"
    },
    {
      code: 'A002',
      number: "2",
      type: "تحصيل",
      name: 'جهة تحصيل 1',
      invoiceDate: '21-11-2024',
      registrationDate: "21-11-2024"
    },
    {
      code: 'A003',
      number: "3",
      type: "صرف",
      name: 'جهة صرف 2',
      invoiceDate: '22-11-2024',
      registrationDate: "22-11-2024"
    },
    {
      code: 'A004',
      number: "4",
      type: "تحصيل",
      name: 'جهة تحصيل 2',
      invoiceDate: '23-11-2024',
      registrationDate: "23-11-2024"
    },
    {
      code: 'A005',
      number: "5",
      type: "صرف",
      name: 'جهة صرف 3',
      invoiceDate: '24-11-2024',
      registrationDate: "24-11-2024"
    },
    {
      code: 'A006',
      number: "6",
      type: "تحصيل",
      name: 'جهة تحصيل 3',
      invoiceDate: '25-11-2024',
      registrationDate: "25-11-2024"
    }
  ];

  const numberColumnHeader = selectedValue === '2' ? "رقم اذن الصرف" : "رقم الفاتوره";
  const nameColumnHeader = selectedValue === '1' ? "اسم جهة التوريد" : selectedValue === '2' ? "اسم جهة الصرف" : "اسم جهة التحويل";

  const columns = [
    {
      name: 'كود الفاتوره',
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
      name: numberColumnHeader,
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let numberStr = row?.number?.length > 10 ? row.numberStr.substring(0, 10) + '...' : row?.number;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {numberStr}
          </div>
        );
      }
    },
    {
      name: 'نوع الفاتورة',
      minWidth: '180px',
      selector: row => row.type,
      sortable: true,
    },
    {
      name: nameColumnHeader,
      minWidth: '200px',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'تاريخ الفاتورة',
      minWidth: '180px',
      selector: row => row.invoiceDate,
      sortable: true,
    },
    {
      name: 'تاريخ التسجيل',
      minWidth: '180px',
      selector: row => row.registrationDate,
      sortable: true,
    },
    {
      name: 'استعراض',
      cell: row =>  <div style={{cursor:"pointer"}}><FaEye size={24} /></div>,
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

  const search = () => {
    
    if(!selectedValue || !secondSelectValue){
      return  toast.error('يجب اختيار الجهة');
      }
    let filteredData = staticData;
  
    // Helper function to convert DD-MM-YYYY to Date object
    const formatDateToObject = (dateString) => {
      let formattedDate;
    
      // Check if the dateString is in YYYY-MM-DD format (standard format supported by JavaScript Date object)
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      
      if (regex.test(dateString)) {
        // Directly parse YYYY-MM-DD format
        formattedDate = new Date(dateString);
      } else {
        // Split by "-" for the DD-MM-YYYY format
        const parts = dateString.split("-");
        
        if (parts.length === 3) {
          // Handle DD-MM-YYYY format by reordering to YYYY-MM-DD for compatibility
          const [day, month, year] = parts;
          formattedDate = new Date(`${year}-${month}-${day}T00:00:00`); // Ensure time is set to midnight
        } else {
          console.error("Invalid date format:", dateString);
          formattedDate = new Date(); // Return today's date if invalid
        }
      }
    
      // Check if the parsed date is valid
      if (isNaN(formattedDate.getTime())) {
        console.error("Invalid Date object:", dateString);
        formattedDate = new Date(); // Return today's date if invalid
      }
    
      return formattedDate;
    };
    
    
    // Format the start and end dates correctly
    const formattedStartDate = formatDateToObject(startDate);
    const formattedEndDate = formatDateToObject(endDate);
  
    console.log("formattedStartDate", formattedStartDate);
    console.log("formattedEndDate", formattedEndDate);
  
    // Filter data based on date range
    if (startDate && endDate) {
      filteredData = filteredData.filter(row => {
        const invoiceDate = row.invoiceDate; // Get invoiceDate
  
        // Convert invoiceDate to Date object
        const formattedInvoiceDate = formatDateToObject(invoiceDate);
  
        console.log("formattedInvoiceDate", formattedInvoiceDate);
  
        // Compare dates
        return formattedInvoiceDate >= formattedStartDate && formattedInvoiceDate <= formattedEndDate;
      });
    }
  
    setTableData(filteredData);
  };
  
  
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
  
  const cancelSearch = () => {
    setSelectedValue(null);
    setSecondSelectValue(null);
    setStartDate('');
    setEndDate('');
    setTableData([]);
  };


  const printReport = () => {
    if (tableData.length === 0) {
      return toast.warning('لا يوجد بيانات للطباعة');

    }

    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>تقرير معاملات الجهة</title><style>');
  
    // Define the print media query and apply RTL styles
    printWindow.document.write('@media print {');
    printWindow.document.write('body { font-family: Arial, sans-serif; font-size: 12px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; direction: rtl; }'); // Set table to RTL
    printWindow.document.write('th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }'); // Set text alignment to right for RTL
    printWindow.document.write('@page { direction: rtl; }'); // Ensure the page itself is in RTL for printing
    printWindow.document.write('}');
  
    printWindow.document.write('</style></head><body>');
  
    printWindow.document.write('<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">');
    printWindow.document.write(`<div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>`);
    printWindow.document.write(`<div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>`);
    printWindow.document.write('</div>');
  
    // Print the table data with RTL column order
    printWindow.document.write('<div><h2 style="text-align: center;">تقرير معاملات الجهة</h2></div>');
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="1" style="width:100%; border-collapse: collapse; direction: rtl;">');
  
    // Define the column headers in RTL order (adjust the headers as per your table structure)
    printWindow.document.write(`<thead><tr><th>كود الفاتوره</th><th>${numberColumnHeader}</th><th>نوع الفاتورة</th><th>${nameColumnHeader}</th><th>تاريخ الفاتورة</th><th>تاريخ التسجيل</th></tr></thead><tbody>`);
  
    // Populate the rows with the actual data from your state (or props, adjust as necessary)
    tableData.forEach(row => {
      printWindow.document.write(`
        <tr>
          <td>${row.code}</td>
          <td>${row.number}</td>
          <td>${row.type}</td>
          <td>${row.name}</td>
          <td>${row.invoiceDate}</td>
          <td>${row.registrationDate}</td>
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

      <h1>تقرير معاملات الجهة</h1>

      <br />
      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
      <label style={{margin:"0 3px"}}> اختر الجهة </label>
        <ReactSelect
          options={Staticoptions}
          value={selectedValue}
          onChange={setSelectedValue}
          placeholder="اختر"
          width="200px"
        />
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        <label style={{margin:"0 3px"}}> اختر الاسم </label>

        <ReactSelect
          options={dynamicOptions}
          value={secondSelectValue}
          onChange={setSecondSelectValue}
          placeholder="اختر"
          width="200px"
        />
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        <label style={{margin:"0 3px"}}>تاريخ البدايه </label>
        <input
          style={{ padding: "5px", border:"1px solid #c2c2c2" , borderRadius:"5px" }}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="تاريخ البدايه"
        />
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        <label style={{margin:"0 3px"}}> تاريخ النهايه</label>

        <input
          style={{ padding: "5px", border:"1px solid #c2c2c2" , borderRadius:"5px" }}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="تاريخ النهايه"
        />
        </div>

      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button style={{ margin: "0 10px 0 0" }} onClick={search} className="btn btn-success">بحث</button>
        <button style={{ margin: "0 10px 0 0" }} onClick={cancelSearch} className="btn btn-danger">إلغاء البحث</button>
        <button style={{ margin: "0 10px 0 0" }} onClick={printReport} className="btn btn-primary">طباعة</button>

      </div>

      <br />

      {/* Print Button */}
      {/* <button onClick={printReport} className="btn btn-primary">طباعة</button> */}

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
