import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../InventoryReportWithoutPrice/logo.jpg'
import { FiRefreshCcw } from "react-icons/fi";


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
  
  console.log("reportsName",report?.categoryObject && report?.categoryObject[0]?.invoicesData[0]?.name  )

  // "supplier"
  // "consumer"
  // "transfer"

  const numberColumnHeader = selectedValue === '2' ? "رقم اذن الصرف" : "رقم الفاتوره";
  const nameColumnHeader = selectedValue === '1' ? " جهة التوريد" : selectedValue === '2' ? " جهة الصرف" : " جهة التحويل";


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
        name: 'م', // Row index column
        minwidth: "30px",
        width:"150px",
        cell: (row, index) => (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {index + 1} {/* Display index starting from 1 */}
          </div>
        ),
      },
      {
        name: 'كود الفاتوره',
        minWidth: '180px',
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
        minWidth: '180px',
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
        minWidth: '180px',
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
        minWidth: '180px',
        selector: row => row?.supplierID?.fullName,
        sortable: true,
      },
      {
        name: 'تاريخ الفاتورة',
        // width: '180px',
        minWidth: '180px',
  
      selector: row => formatDate(row.supplyDate),
        sortable: true,
      },
      {
        name: 'تاريخ التسجيل',
        // width: '180px',
        minWidth: '180px',
        selector: row => formatDate(row.registerDate),
        sortable: true,
      },
      {
        name: 'استعراض',
        width:"130px",
        cell: row =>  <div style={{cursor:"pointer", color:"#ff0000"}}><FaEye size={24} onClick={()=>{
          navigate('/print',{state:row})
        }} /></div>,
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
          borderBottom: '1px solid #c1c1c1',
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


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  
  
  const cancelSearch = () => {
    setSelectedValue('');
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
               </div>
               
               <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
                 ">
                 <img src=${logo} alt="Logo" style="width: 130px; height: 90px; ">
               </div>
               </div>
             `);
         

    // Print the table data with RTL column order
    printWindow.document.write(`<div style="margin:0 0 30px 0">
        <h2 style="text-align: center; text-decoration: underline; text-underline-offset: 7px; font-size:20px; font-weight:800">
      تقرير معاملات صنف ( ${report?.categoryObject[0]?.invoicesData[0]?.name} )  </h2></div>`);
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="5" style="width:100%;  table-layout: fixed; padding:20px; border-collapse: collapse; direction: rtl;  text-align: center;">');
  
    // Define the column headers in RTL order (adjust the headers as per your table structure)
    printWindow.document.write(`
      <thead style="border-bottom: 5px solid black; background:#e9ecef; ">
      <tr>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:7%;" >
      <div style=" display:flex; justify-content: center; align-items: center; ">م</div></th>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:30%;" >
      <div style=" display:flex; justify-content: center; align-items: center; ">كود الفاتوره</div></th>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:30%;">
      <div style=" display:flex; justify-content: center; align-items: center; ">${numberColumnHeader}</div></th>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:15%;">
      <div style=" display:flex; justify-content: center; align-items: center; ">نوع الفاتورة</div></th>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:25%;">
      <div style=" display:flex; justify-content: center; align-items: center; ">${nameColumnHeader}</div></th>
      <th style ="padding:8px; font-size:16px; font-weight:700;  border-right: 5px solid black; width:18%;">
      <div style=" display:flex; justify-content: center; align-items: center; ">تاريخ الفاتورة</div></th>
      </tr></thead>`);
  
  
    // Populate the rows with the actual data from your state (or props, adjust as necessary)


    report?.categoryObject.forEach((row, index) => {
      printWindow.document.write(`
        <tbody style="border-bottom: 2px solid black;">
       <tr style="padding:5px; border-right: 2px solid black;">
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef; ">
         <div style=" display:flex; justify-content: center; align-items: center; ">${index+1}</div></td>
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
         <div style=" display:flex; justify-content: center; align-items: center; ">${row?.invoiceCode}</div></td>
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
         <div style=" display:flex; justify-content: center; align-items: center; ">${row?.serialNumber}</div></td>
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
         <div style=" display:flex; justify-content: center; align-items: center; ">
         ${
           row?.type === "payment" ? "صرف" :
           row?.type === "supply" ? "توريد" :
           row?.type === "convert" ? "تحويل" :
           ""
         }
         </div>
         </td>
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
         <div style=" display:flex; justify-content: center; align-items: center; ">${row?.supplierID?.fullName}
         </div></td>
         <td style="padding:5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
         <div style=" display:flex; justify-content: center; align-items: center; ">${formatDate(row?.supplyDate)}</div></td>
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


      <h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"380px" }} >تقرير معاملات الصنف</h1>

      <br />

      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
<div style={{display:"flex", flexDirection:"column", gap:"8px"}}>

<label style={{margin:"0 3px", fontWeight:"700"}}> كود الصنف </label>
      <input
          style={{ padding: "5px", border:"1px solid #c2c2c2" , borderRadius:"5px" }}
          type="text"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          placeholder=" ادخل كود الصنف"
        />  
</div>
<div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        <label style={{margin:"0 3px", fontWeight:"700"}}>تاريخ البدايه </label>
        <input
          style={{ padding: "5px", border:"1px solid #c2c2c2" , borderRadius:"5px" }}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="تاريخ البدايه"
        />
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        <label style={{margin:"0 3px", fontWeight:"700"}}> تاريخ النهايه</label>

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
           <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={getReport} className="btn btn-success"> { "بحث"}</button>
           <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={printReport} className="btn btn-primary">طباعة</button>
           <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={cancelSearch} className="btn btn-danger"><FiRefreshCcw size={'24px'}/>        </button>
   
         </div>

      <br />
     {report?.categoryObject && <div style={{background:"#e9ecef",margin:"auto",border:"1px solid #c1c1c1", borderRadius:"8px",height:"40px", display:"flex", justifyContent:"center",gap:"10px", alignItems:"center",width:"375px"}}>
      <div style={{margin:"0 4px"}}>اسم الصنف : </div>
      <div> { report?.categoryObject[0]?.invoicesData[0]?.name}</div>
        
      </div>}

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
