import React, { useState, useEffect } from 'react';
import ReactSelect from '../../../Utilities/ReactSelect'; // Adjust the path as needed
import DataTable from "react-data-table-component";
import { toast } from 'react-toastify';

export default function InventoryReportComponent() {
  const [selectedValue, setSelectedValue] = useState(null); // Track first select value
  const [secondSelectValue, setSecondSelectValue] = useState(null); // Track second select value
  const [tableData, setTableData] = useState([]); // Data to be displayed in the table
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (selectedValue === null) {
      setSelectedValue(null);
      setSecondSelectValue(null);
    }
  }, [selectedValue]);


  // useEffect(() => {
  //   const get = async () => {
  //     const result = await window?.electron?.getAllUsers({
  //       type: 'allSuppliers'
  //     });
      
  //     console.log('result', result);

  //     setUsers(result?.users);
  //   }

   
  //   get();
    
  // }, []);
  // console.log('users', users);

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
  }, 0).toFixed(3));

  console.log("dynamicData",dynamicData)

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
  
  // Usage examples
  console.log(`التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}`); // e.g., "2024-11-24"
  console.log(`الوفت: ${timePart}`); // e.g., "03:45:23 PM"
  


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

  // console.log("categoriesUsers",categoriesUsers)
  console.log("categories",categories)

  // "supplier"
  // "consumer"
  // "transfer"

  console.log("selectedValue",selectedValue)
  console.log("secondSelectValue",secondSelectValue)
  // const Staticoptions = [
  //   { value: '1', label: 'اسم المورد' },
  //   { value: '2', label: 'اسم جهة الصرف' },
  //   { value: '3', label: 'اسم جهه التحويل' },
  // ];

  // const options1 = users.filter(user => user.type === "supplier").map(user => ({
  //   value: user._id, 
  //   label: user.fullName
  // }));

  // const options2 = users.filter(user => user.type === "consumer").map(user => ({
  //   value: user._id, 
  //   label: user.fullName
  // }));

  // const options3 = users.filter(user => user.type === "transfer").map(user => ({
  //   value: user._id, 
  //   label: user.fullName
  // }));

  // const dynamicOptions =
  //   selectedValue === '1' ? options1 :
  //   selectedValue === '2' ? options2 :
  //   selectedValue === '3' ? options3 : [];

  const staticData = [
    { code: 'A001', name: 'منتج 1', unit: 'قطعة', totalQuantity: 100, unitPrice: 50 },
    { code: 'A002', name: 'منتج 2', unit: 'علبة', totalQuantity: 200, unitPrice: 30 },
    { code: 'A003', name: 'منتج 3', unit: 'كرتونة', totalQuantity: 50, unitPrice: 70 },
  ];

  const columns = [
    {
      name: 'الكود',
      minwidth: '180px',
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
      selector: row => row.unitPrice,
      sortable: true,
    },
    {
      name: 'الاجمالي',
      minwidth: '180px',
      selector: row => row.unitPrice * row.totalQuantity,
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

  // const search = () => {
    // if (selectedValue === '1' && secondSelectValue) {
      // Filter categories based on selectedValue and secondSelectValue
      // const filteredCategories = categories.filter(category => category?.user?._id === secondSelectValue);
      // const dynamicData = categories.map(category => ({
      //   code: category?.code,
      //   name: category?.name,
      //   unit: category?.unit,
      //   totalQuantity: category?.totalQuantity,
      //   unitPrice: category?.unitPrice,
      // }));
    // } else {
      // setTableData([]); // Reset tableData if no match
    // }
  // };


  
  // const cancelSearch = () => {
  //   setSelectedValue(null);
  //   setSecondSelectValue(null);
  //   setTableData([]);
  // };


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
  
    // Print the title and date/time in flex layout
    printWindow.document.write('<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">');
    printWindow.document.write(`<div><h2 style="margin: 0;">الوقت: ${timePart}</h2></div>`);
    printWindow.document.write(`<div><h2 style="margin: 0;">التاريخ: ${datePart.year}-${datePart.month}-${datePart.day}</h2></div>`);
    printWindow.document.write('</div>');
    
    // Print the table data with RTL column order
    printWindow.document.write('<div><h2 style="text-align: center;">تقرير الجرد</h2></div>');
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table border="1" style="width:100%; border-collapse: collapse; direction: rtl;">');
    
    // Define the column headers in RTL order
    printWindow.document.write('<thead><tr><th>الكود</th><th>الاسم</th><th>الوحدة</th><th>الكمية</th><th>سعر الوحدة</th><th>الاجمالي</th></tr></thead><tbody>');
    
    // Populate the rows with the reversed order of columns
    tableData.forEach(row => {
      printWindow.document.write(`
        <tr>
        <td>${row.code}</td>
        <td>${row.name}</td>
        <td>${row.unit}</td>
        <td>${row.totalQuantity}</td>
        <td>${row.unitPrice}</td>
        <td>${row.unitPrice * row.totalQuantity}</td>
        </tr>
        `);
      });
      
      printWindow.document.write('</tbody></table>');
      printWindow.document.write('<div style="display: flex; justify-content: center ; align-items: center; padding: 10px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">');
      printWindow.document.write(`<div><h2 style="margin: 0;"> إجمالي سعر الأصناف بالمخزن : ${totalUnitPrice}</h2></div>`);
    printWindow.document.write('</div>');
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
    color: "#bb0000",
    fontWeight: "bold",
    fontSize: "18px"
  }}>
    إجمالي سعر الأصناف بالمخزن :
  </div>
  <div style={{
    fontSize: "16px",
    fontWeight: "600",
    color: "#bb0000"
  }}>
    <span>{totalUnitPrice}</span>
    <span> </span>
    <span>جنيه </span>
  </div>
</div>

    </div>
  );
}
