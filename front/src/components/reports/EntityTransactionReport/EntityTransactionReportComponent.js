import React, { useState, useEffect } from 'react';
import ReactSelect from '../../../Utilities/ReactSelect'; // Adjust the path as needed
import DataTable from "react-data-table-component"
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import logo from '../InventoryReportWithoutPrice/logo.jpg'
import { FiRefreshCcw } from "react-icons/fi";

export default function EntityTransactionReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null); // Track first select value
  const [secondSelectValue, setSecondSelectValue] = useState(null); // Track second select value
  const [startDate, setStartDate] = useState(''); // Track start date
  const [endDate, setEndDate] = useState(''); // Track end date
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const getReport = async () => {
    try {
      if (!secondSelectValue) {
        return toast.error('يجب اختيار الجهة');
      }

      const data = {
        // invoiceCode: selectedValue ,
        supplierID: secondSelectValue,
        startDate: startDate,
        endDate: endDate,
      };

      setIsLoading(true)
      const reports = await window?.electron?.searchForReport(data)
      console.log('reports', reports);
      setReport(reports);

    } catch (error) {
      console.log("Error")
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }

  }

  console.log("report", report?.categoryObject)

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
    { value: '1', label: 'جهة توريد' },
    { value: '2', label: ' جهة صرف' },
    { value: '3', label: ' جهه تحويل' },
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


  console.log("isLoading", isLoading);


  const totalInvoicesPrice = report?.categoryObject?.reduce((sum, tableData) => {
    // Ensure `total_bill_price` is treated as a number
    return sum + (Number(tableData?.total_bill_price) || 0);
  }, 0) || 0; // Default to 0 if report or categoryObject is undefined
  
  // Format to 2 decimal places
  const formattedTotalInvoicesPrice = parseFloat(totalInvoicesPrice.toFixed(2));
  
  // Log the formatted result
  console.log("Total Invoices Price:", formattedTotalInvoicesPrice);


   
    // اجمالي فواتير التحويل للاصناف (الصرف)
    const totalInvoicesPriceForConvert1 = report?.categoryObject?.reduce((sum, tableData) => {
      // Ensure `total_bill_price` is treated as a number
      return sum + (Number(tableData?.total_suplly_price) || 0);
    }, 0) || 0; // Default to 0 if report or categoryObject is undefined
    
    // اجمالي فواتير التحويل للاصناف (التوريد)
    const totalInvoicesPriceForConvert2 = report?.categoryObject?.reduce((sum, tableData) => {
      // Ensure `total_bill_price` is treated as a number
      return sum + (Number(tableData?.total_payment_price) || 0);
    }, 0) || 0; // Default to 0 if report or categoryObject is undefined
  
    

  const numberColumnHeader = selectedValue === '2' ? "رقم اذن الصرف" : "رقم الفاتوره";
  const nameColumnHeader = selectedValue === '1' ? "اسم جهة التوريد" : selectedValue === '2' ? "اسم جهة الصرف" : "اسم جهة التحويل";
  const totalInvoicesNames = selectedValue == '1' ? "إجمالي فواتير التوريد : " : selectedValue == '2' ? "إجمالي فواتير الصرف : " : "إجمالي فواتير التحويل : ";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const columns = [
    {
      name: 'م', // Row index column
      minwidth: "30px",
      width:"150px",
      cell: (row, index) => (
        <div style={{ textAlign: 'center', width: '100%'  }}>
          {index + 1} {/* Display index starting from 1 */}
        </div>
      ),
    },
    {
      name: 'كود الفاتوره',
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let codeStr = row?.invoiceCode;
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
        let numberStr = row?.serialNumber;
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


    // {
    //   name: nameColumnHeader,
    //   // width: '200px',
    //   selector: row => row?.supplierID?.fullName,
    //   sortable: true,
    // },
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
      width: "130px",
      cell: row => <div style={{ cursor: "pointer", color:"#ff0000" }}><FaEye size={24} onClick={() => {
        navigate('/print', { state: row })
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

  // const { datePart, timePart } = getCurrentDate();

  const cancelSearch = () => {
    setSelectedValue(null);
    setSecondSelectValue(null);
    setStartDate('');
    setEndDate('');
    setReport([]);
  };




  const printReport = () => {
    if (report?.categoryObject?.length == 0 || report?.length == 0) {
      return toast.warning('لا يوجد بيانات للطباعة');

    }

    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>تقرير معاملات الجهة</title><style>');

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
               </div>
               
               <div style="display: flex; justify-content:center; align-items: center; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 20px; text-underline-offset: 7px;
                 ">
                 <img src=${logo} alt="Logo" style="width: 130px; height: 90px; ">
               </div>
               </div>
             `);



    // Print the table data with RTL column order
    printWindow.document.write(`<div style="margin:0 0 30px 0">
        <h2 style="text-align: center; text-decoration: underline; text-underline-offset: 7px; font-size:18px; font-weight:800 direction: rtl;">
       <span>تقرير معامله جهة : </span>
       <span> ${report?.categoryObject[0]?.supplierID.fullName} </span>  </h2></div>`);
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="5" style="width:100%;  table-layout: fixed; padding:20px; border-collapse: collapse; direction: rtl;  text-align: center;">');

    // Define the column headers in RTL order (adjust the headers as per your table structure)
    printWindow.document.write(`
      <thead style="border-bottom: 5px solid black; background:#e9ecef; ">
   <tr>
  <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 7%; word-wrap: break-word;">
   <div style=" display:flex; justify-content: center; align-items: center; ">م</div></th>
  <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 35%; word-wrap: break-word;">
   <div style=" display:flex; justify-content: center; align-items: center; ">كود الفاتوره</div></th>
  <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 35%; word-wrap: break-word;">
   <div style=" display:flex; justify-content: center; align-items: center; ">${numberColumnHeader}</div></th>
  <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 15%; word-wrap: break-word;">
   <div style=" display:flex; justify-content: center; align-items: center; ">نوع الفاتورة</div></th>
  <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 18%; word-wrap: break-word;">
   <div style=" display:flex; justify-content: center; align-items: center; ">تاريخ الفاتورة</div></th>

</tr>

      </thead>`);

    // Populate the rows with the actual data from your state (or props, adjust as necessary)
    report?.categoryObject.forEach((row, index) => {
      printWindow.document.write(`
        <tbody style="border-bottom: 2px solid black;">
        <tr style="padding:5px; border-right: 2px solid black;">
          <td style="padding:3px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; background:#e9ecef;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${index + 1}</div></td>
          <td style="padding:3px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row?.invoiceCode}</div></td>
          <td style="padding:3px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${row?.serialNumber}</div></td>
          <td style="padding:3px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
          <div style=" display:flex; justify-content: center; align-items: center; ">
            ${
              row?.type === "payment" ? "صرف" :
              row?.type === "supply" ? "توريد" :
              row?.type === "convert" ? "تحويل" :
              ""
            }
            </div>
          </td>
          <td style="padding:3px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word;">
          <div style=" display:flex; justify-content: center; align-items: center; ">${formatDate(row?.supplyDate)}</div></td>
        </tr>
      `);
    });

    if (selectedValue != '3') {
      printWindow.document.write(`
        <tr style="
          font-weight: bold;
          padding: 5px;
          border-top: 2px solid black;
          text-align: center;
        ">
          <td colspan="2" style="
            padding: 10px;
            font-size: 16px;
            font-weight: 700;
            border-right: 5px solid black;
          ">
          <div style=" display:flex; justify-content: center; align-items: center; ">
            <span>المجموع الكلي</span>
            </div>
            </td>
            <td colspan="3" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 500;
            border-right: 5px solid black;
          ">
          <div style=" display:flex; justify-content: center; align-items: center; ">
            <span>${formattedTotalInvoicesPrice}</span>
            <span style="margin:0 2px"> جنية </span>
            </td>
            </div>
        </tr>
      `);
    }
    
    // if (selectedValue == '3') {
    //   printWindow.document.write(`
    //     <tr style="
    //       font-weight: bold;
    //       padding: 5px;
    //       border-top: 2px solid black;
    //       text-align: center;
    //     ">
    //       <td colspan="7" style="
    //         padding: 10px;
    //         font-size: 28px;
    //         font-weight: 900;
    //         border-right: 5px solid black;
    //       ">
    //         <span>اجمالي فواتير التحويل  ( التوريد ) :  </span>
    //         <span>${totalInvoicesPriceForConvert2}</span>
    //         <span> جنية </span>
    //       </td>
    //     </tr>
    //   `);
    //   printWindow.document.write(`
    //     <tr style="
    //       font-weight: bold;
    //       padding: 5px;
    //       border-top: 2px solid black;
    //       text-align: center;
    //     ">
    //       <td colspan="7" style="
    //         padding: 10px;
    //         font-size: 28px;
    //         font-weight: 900;
    //         border-right: 5px solid black;
    //       ">
    //         <span>اجمالي فواتير التحويل  ( الصرف ) :  </span>
    //         <span>${totalInvoicesPriceForConvert1}</span>
    //         <span> جنية </span>
    //       </td>
    //     </tr>
    //   `);
    // }
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</div>');
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

      <h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"365px" }}>تقرير معاملات الجهة</h1>

      <br />
      {/* Select Inputs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ margin: "0 3px" , fontWeight:"700"}}> اختر الجهة </label>
          <ReactSelect
            options={Staticoptions}
            value={selectedValue}
            onChange={setSelectedValue}
            setReport={setReport}
            placeholder="اختر"
            width="200px"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ margin: "0 3px" ,fontWeight:"700" }}> اختر الاسم </label>

          <ReactSelect
            options={dynamicOptions}
            value={secondSelectValue}
            onChange={setSecondSelectValue}
            setReport={setReport}
            placeholder="اختر"
            width="200px"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ margin: "0 3px" ,fontWeight:"700" }}>تاريخ البدايه </label>
          <input
            style={{ padding: "5px", border: "1px solid #c2c2c2", borderRadius: "5px" }}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="تاريخ البدايه"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ margin: "0 3px",  fontWeight:"700" }}> تاريخ النهايه</label>

          <input
            style={{ padding: "5px", border: "1px solid #c2c2c2", borderRadius: "5px" }}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="تاريخ النهايه"
          />
        </div>

      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={getReport} disabled={isLoading} className="btn btn-success"> {isLoading ? <Spinner /> : "بحث"}</button>
        <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={printReport} className="btn btn-primary">طباعة</button>
        <button style={{ margin: "0 10px 0 0" ,width: '80px'}} onClick={cancelSearch} className="btn btn-danger"><FiRefreshCcw size={'24px'}/>        </button>

      </div>

      <br />

      {/* Print Button */}
      {/* <button onClick={printReport} className="btn btn-primary">طباعة</button> */}

      <br />

      {/* Scrollable Table Container */}
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        {isLoading ? <Spinner /> :
          <DataTable
            columns={columns}
            data={report?.categoryObject} // Display the filtered data
            conditionalRowStyles={[]}
            customStyles={customStyles}
            pagination
          />
        }

      </div>
      {selectedValue != '3' &&  report?.categoryObject?.length !=0 && report.length !=0 &&     <div style={{
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
{totalInvoicesNames}
  </div>
  <div style={{
    fontSize: "22px",
    fontWeight: "900",
    color: "#333"
  }}>
    <span>{formattedTotalInvoicesPrice}</span>
    <span> </span>
    <span>جنيه </span>
  </div>
</div>}

  {/* {selectedValue == '3' &&  report?.categoryObject?.length !=0 && report.length !=0 &&     <div style={{
  display: "flex",
  flexDirection:'row',
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
}}>
  <div style={{display:'flex'}}>
  <div style={{
    color: "#333",
    fontWeight: "900",
    fontSize: "22px",
    margin:"0 5px"
  }}>
اجمالي فواتير التحويل  ( التوريد ) :     
  </div>
  <div style={{
    fontSize: "22px",
    fontWeight: "900",
    color: "#333"
  }}>
    <span> {totalInvoicesPriceForConvert2} </span>
    <span> </span>
    <span>جنيه </span>
  </div>
  </div>
  <div style={{display:'flex'}}>
  <div style={{
    color: "#333",
    fontWeight: "900",
    fontSize: "22px",
    margin:"0 5px"
  }}>
اجمالي فواتير التحويل  ( الصرف ) : 
  </div>
  <div style={{
    fontSize: "22px",
    fontWeight: "900",
    color: "#333"
  }}>
    <span> {totalInvoicesPriceForConvert1} </span>
    <span> </span>
    <span>جنيه </span>
  </div>
  </div>
</div>} */}

    </div>
  );
}
