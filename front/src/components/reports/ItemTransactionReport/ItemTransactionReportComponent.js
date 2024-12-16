import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function ItemTransactionReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null); // Track first select value
  const [startDate, setStartDate] = useState(''); // Track start date
  const [endDate, setEndDate] = useState(''); // Track end date
  const [tableData, setTableData] = useState([]); // Data to be displayed in the table
  const [report, setReport] = useState([]); // Track first select value
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  console.log("tableData",tableData)

  const getReport = async () => {
    try {
      if(!selectedValue){
        return  toast.error('يجب ادخال كود الصنف ');
        }

      const data = {
        // invoiceCode: selectedValue ,
        itemCode: Number(selectedValue),
        startDate: startDate,
        endDate: endDate,
      };
     console.log("data",data)
      setIsLoading(true)
      const reports = await window?.electron?.searchForReport(data)
      console.log('reports', reports);
      setReport(reports);
      
    } catch (error) {
      console.log("Error")
      setIsLoading(false)
    } finally{
      setIsLoading(false)
    }
    
  }

  console.log("report",report?.categoryObject)

  // "supplier"
  // "consumer"
  // "transfer"

  const numberColumnHeader = selectedValue === '2' ? "رقم اذن الصرف" : "رقم الفاتوره";
  const nameColumnHeader = selectedValue === '1' ? "اسم جهة التوريد" : selectedValue === '2' ? "اسم جهة الصرف" : "اسم جهة التحويل";


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
  const columns = [
    {
      name: 'كود الفاتوره',
      // width: '180px',
      sortable: true,
      cell: row => {
        let codeStr = row?.invoiceCode ;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {codeStr}
          </div>
        );
      }
    },
    {
      name: numberColumnHeader,
      // width: '180px',
      sortable: true,
      cell: row => {
        let numberStr =row?.serialNumber;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {numberStr}
          </div>
        );
      }
    },
    {
      name: 'نوع الفاتورة',
      // width: '180px',
      selector: row => 
        row?.type == "payment" 
          ? "صرف" 
          : row?.type == "supply" 
            ? "توريد" 
            : row?.type == "convert" 
              ? "تحويل" 
              : "",
                    sortable: true,
    },
    {
      name: nameColumnHeader,
      // width: '200px',
      selector: row => row?.supplierID?.fullName,
      sortable: true,
    },
    {
      name: 'تاريخ الفاتورة',
      // width: '180px',
    selector: row => formatDate(row.supplyDate),
      sortable: true,
    },
    {
      name: 'تاريخ التسجيل',
      // width: '180px',
      selector: row => formatDate(row.registerDate),
      sortable: true,
    },
    {
      name: 'استعراض',
      cell: row =>  <div style={{cursor:"pointer"}}><FaEye size={24} onClick={()=>{
        navigate('/print',{state:row})
      }} /></div>,
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



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  
  
  const cancelSearch = () => {
    setSelectedValue(null);
    setStartDate('');
    setEndDate('');
    setReport([]);
  };

  const printReport = () => {
    if (report?.categoryObject?.length == 0 || report?.length == 0) {
      return toast.warning('لا يوجد بيانات للطباعة');

    }

    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>تقرير معاملات الصنف</title><style>');
  
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
    printWindow.document.write(`<div><h2 style="text-align: center; text-decoration: underline; font-size:28px; font-weight:800"> تقرير معاملات الصنف  </h2></div>`);
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="1" style="width:100%; padding:20px; border-collapse: collapse; direction: rtl;  text-align: center;">');
  
    // Define the column headers in RTL order (adjust the headers as per your table structure)
    printWindow.document.write(`<thead><tr><th style ="padding:8px; font-size:24px; font-weight:800 " >كود الفاتوره</th><th style ="padding:8px; font-size:24px; font-weight:800 ">${numberColumnHeader}</th><th style ="padding:8px; font-size:24px; font-weight:800 ">نوع الفاتورة</th><th style ="padding:8px; font-size:24px; font-weight:800 ">${nameColumnHeader}</th><th style ="padding:8px; font-size:24px; font-weight:800 ">تاريخ الفاتورة</th><th style ="padding:8px; font-size:24px; font-weight:800 ">تاريخ التسجيل</th></tr></thead><tbody>`);
  
    // Populate the rows with the actual data from your state (or props, adjust as necessary)
    report?.categoryObject.forEach(row => {
      printWindow.document.write(`
        <tr style="padding:5px">
          <td style="padding:5px">${row?.invoiceCode}</td>
          <td  style="padding:5px">${row?.serialNumber}</td>
          <td  style="padding:5px">${row?.type}</td>
          <td  style="padding:5px">${row?.supplierID?.fullName}</td>
          <td  style="padding:5px">${formatDate(row?.supplyDate)}</td>
          <td  style="padding:5px">${formatDate(row?.registerDate)}</td>
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
      <h1>تقرير معاملات الصنف</h1>

      <br />

      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
<div style={{display:"flex", flexDirection:"column", gap:"8px"}}>

<label style={{margin:"0 3px"}}> كود الصنف </label>
      <input
          style={{ padding: "5px", border:"1px solid #c2c2c2" , borderRadius:"5px" }}
          type="text"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          placeholder=" ادخل كود الصنف"
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
        <button style={{ margin: "0 10px 0 0" }} onClick={getReport} className="btn btn-success">بحث</button>
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
          data={report?.categoryObject} // Display the filtered data
          conditionalRowStyles={[]}
          customStyles={customStyles}
          pagination
        />
      </div>


    </div>
  );
}
