import React, { useState, useEffect } from 'react';
import ReactSelect from '../../../Utilities/ReactSelect'; // Adjust the path as needed
import DataTable from "react-data-table-component"
import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import logo from '../InventoryReportWithoutPrice/logo.jpg'
import { FiRefreshCcw } from "react-icons/fi";

export default function EntityTransactionItemsReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null); // Track first select value
  const [secondSelectValue, setSecondSelectValue] = useState(null); // Track second select value
  const [startDate, setStartDate] = useState(''); // Track start date
  const [endDate, setEndDate] = useState(''); // Track end date
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isBeforeTransfare, setIsBeforeTransfare] = useState(true);


  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const getReport = async () => {
    try {
      if (!secondSelectValue) {
        return toast.error('يجب اختيار الجهة');
      }

      let data;
      if(selectedValue =='3'){
         data = {
          // invoiceCode: selectedValue ,
          supplierID: secondSelectValue,
          startDate: startDate,
          endDate: endDate,
          isItem:true,
          isBeforeTransfare:isBeforeTransfare
        };
      }
      else{
         data = {
          // invoiceCode: selectedValue ,
          supplierID: secondSelectValue,
          startDate: startDate,
          endDate: endDate,
          isItem:true
        };
      }
     

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



  const total = report?.finalList?.[report.finalList.length - 1]?.finalPrice; // Get last element

  const formattedTotalInvoicesPrice = parseFloat(Number(total).toFixed(2));
  


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
      name: 'الكود',
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let codeStr = row?.code;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {codeStr}
          </div>
        );
      }
    },
    {
      name: "الصنف",
      // width: '180px',
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let numberStr = row?.name;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {numberStr}
          </div>
        );
      }
    },
    {
      name: "الوحدة",
      // width: '180px',
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let numberStr = row?.unit;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {numberStr}
          </div>
        );
      }
    },
    {
      name: "الكمية",
      // width: '180px',
      minWidth: '180px',
      sortable: true,
      cell: row => {
        let numberStr = row?.quantity;
        return (
          <div style={{ textAlign: 'center', whiteSpace: 'normal', wordWrap: 'break-word', width: '100%' }}>
            {numberStr}
          </div>
        );
      }
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



  const cancelSearch = () => {
    setSelectedValue(null);
    setSecondSelectValue(null);
    setStartDate('');
    setEndDate('');
    setReport([]);
  };




  const printReport = () => {

    if ( report?.finalList?.length > 0) {
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
           <div style="font-weight: 500; font-size: 14px;">  تاريخ الطباعة </div> <span style="color:#fff">..</span> <div style:"font-weight: 300; font-size: 11px; ">${formatDate(today)}</div>
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
  تقرير معاملات الجهة (أصناف)
          </h2>
        </div>
      `);
    
      // Table
      printWindow.document.write(`
        <div class="table-container">
          <table border="5" style="width:100%;  table-layout: fixed; border-collapse: collapse; direction: rtl; text-align: center;">
            <thead style="border-bottom: 5px solid black; background:#e9ecef;">
              <tr>
                <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 5%; ">
                <div style=" display:flex; justify-content: center; align-items: center; ">م</div></th>
                <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center; ">الكود</div></th>
                <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 30%;">
                <div style=" display:flex; justify-content: center; align-items: center; ">الصنف</div></th>
                <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center; ">الوحدة</div></th>
                <th style="padding: 5px; font-size: 16px; font-weight: 700; border-right: 5px solid black; width: 10%;">
                <div style=" display:flex; justify-content: center; align-items: center; ">الكمية</div></th>
              </tr>
            </thead>
            <tbody>
      `);
    
      // Populate rows and calculate totals
    
      report?.finalList?.slice(0, -1).forEach((row, index) => {
       
        const total = report?.finalList?.[report.finalList.length - 1]?.finalPrice; // Get last element
        printWindow.document.write(`
          <tr style="border-bottom: 2px solid black;">
            <td style="min-width: 40px;  padding: 5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; word-break: break-all; background:#e9ecef;">
            <div style=" display:flex; justify-content: center; align-items: center; ">${index+1}</div></td>
            <td style="min-width: 60px;  padding: 5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
            <div style=" display:flex; justify-content: center; align-items: center; ">${row.code}</div></td>
            <td style="min-width: 200px; padding: 5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
            <div style=" display:flex; justify-content: center; align-items: center; ">${row.name}</div></td>
            <td style="min-width: 70px;  padding: 5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
            <div style=" display:flex; justify-content: center; align-items: center; ">${row.unit}</div></td>
            <td style="min-width: 80px;  padding: 5px; font-size: 14px; font-weight: 500; border-right: 5px solid black; word-wrap: break-word; word-break: break-all;">
            <div style=" display:flex; justify-content: center; align-items: center; ">${row.quantity}
            </div></td>
  
          </tr>
        `);
      });
    
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
            <span>الإجمالي</span>
            </div>
            </td>
            <td colspan="3" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 500;
            border-right: 5px solid black;
          ">
          <div style=" display:flex; justify-content: center; align-items: center; ">
            <span>${total.toFixed(2)}</span>
            <span style="margin:0 4px;"> جنية </span>
            </td>
            </div>
        </tr>
      `);
  
      // Close table body
      printWindow.document.write(`
     
            </tbody>
          </table>
        </div>
      `);
    
    
    
      // Close HTML
      printWindow.document.write('</body></html>');
    
      printWindow.document.close(); // Necessary for IE >= 10
      printWindow.print();    }
      else{
        return toast.warning('لا يوجد بيانات للطباعة');

      }
  
  
  };
  


  const handleButtonClick = async (isBefore) => {
    if(secondSelectValue){
      setIsBeforeTransfare(isBefore);
      let data;
      data = {
        // invoiceCode: selectedValue ,
        supplierID: secondSelectValue,
        startDate: startDate,
        endDate: endDate,
        isItem:true,
        isBeforeTransfare:isBeforeTransfare
      };
      const reports = await window?.electron?.searchForReport(data)
      setReport(reports);

    }
    else{
      return toast.error('يجب اختيار الجهة');
    }
  };

  const buttonStyles = (isSelected) => ({
    backgroundColor: isSelected ? 'orange' : 'white',
    color: isSelected ? '#fff' : 'orange',
    border: '2px solid orange',
    padding: '10px 20px',
    cursor: 'pointer',
    margin: '5px',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
  });


  return (
    <div className="h-100">
      <h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"515px" }}>تقرير معاملات الجهة (أصناف)</h1>

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

      {selectedValue === '3' && (
        <div>
          <button
            style={buttonStyles(isBeforeTransfare)}
            onClick={() => handleButtonClick(true)}
          >
            الاصناف قبل التحويل
          </button>
          <button
            style={buttonStyles(!isBeforeTransfare)}
            onClick={() => handleButtonClick(false)}
          >
            الاصناف بعد التحويل
          </button>
        </div>
      )}
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
            data={report?.finalList?.slice(0, -1)} 
            conditionalRowStyles={[]}
            customStyles={customStyles}
            pagination
          />
        }

      </div>
      { report?.finalList?.length > 0 && <div style={{
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
{"الاجمالي"}
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

    </div>
  );
}
