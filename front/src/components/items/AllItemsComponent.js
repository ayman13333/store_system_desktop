import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AlarmComponent from "./AlarmComponent";
import SearchItemsComponent from "./SearchItemsComponent";
import DataTable from "react-data-table-component";
import { CiEdit } from "react-icons/ci";
import ExpirationDatesModal from "../invoices/supplyInvoice/ExpirationDatesModal";
import { ligthBlue, orange, red, yellow } from "../../Constants"

export default function AllItemsComponent() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showExpirationDatesModal, setShowExpirationDatesModal] = useState(false);
  const [categoryToShow, setCategoryToShow] = useState(null);


  useEffect(() => {
    const get = async () => {
      setIsLoading(true);
      const [result] = await Promise.all([
        window?.electron?.getAllCategories()
      ]);

      // console.log('categories', categories);
      setIsLoading(false);
      console.log('result', result);

      setCategories(result?.categories);
    }

    get();
  }, []);

  

  const columns = [
    { name: 'الكود', selector: row => row.code, sortable: true },
    { name: 'الاسم', selector: row => row.name, sortable: true },
    {
      name: 'الحد الحرج',
      selector: row => row.criticalValue,
      sortable: true,
      cell: row => (
        <div style={{ backgroundColor: row.criticalValue === row.totalQuantity ? orange : '', width: '100%', textAlign:'start' }}>
          {row.criticalValue}
        </div>
      )
    },
    { name: 'الوحدة', selector: row => row.unit, sortable: true },
    {
      name: 'تاريخ الصلاحية',
      cell: (row) => {
        const currentDate=new Date();
        let isYellow=false;
        let isRed=false;
        let yellowCount=0;

        row?.expirationDatesArr?.map(el=>{
          const itemDate = new Date(el?.date);
          if(currentDate.getTime() > itemDate.getTime() ){
            isYellow=true;
            yellowCount++;
          } 
        });

        if(yellowCount== row?.expirationDatesArr?.length) isRed=true;

        let color='';
        if(isRed==true) color=red;
        else{
          if(isYellow) color=yellow;
        }
        return (
          <div style={{ backgroundColor: color, width: '100%' }} >
            <button
              onClick={() => {
                setCategoryToShow(row);
                setShowExpirationDatesModal(true);
              }}
              className='btn btn-secondary' style={{
                whiteSpace: 'nowrap',
                width:'80%'
              }} > اضغط هنا  </button>
          </div>
        )
      }
      ,
      sortable: true
    },
    { name: 'الكمية', selector: row => row.totalQuantity, sortable: true },
    { name: 'سعر الوحدة', selector: row => row.unitPrice, sortable: true },
    { name: 'الاجمالي', selector: row => Number(row?.unitPrice * row?.totalQuantity), sortable: true },
    {
      name: 'تعديل',
      cell: (row) => <button className='btn btn-warning' onClick={() => {
        //  console.log('row',row);
          navigate('/allitems/edit',{
            state:row
          });
      }}
        style={{
          whiteSpace: 'nowrap'
        }}
      > تعديل  <CiEdit /> </button>
    }

  ];

  const conditionalRowStyles = [
    {
      when: row => true, // Apply to all rows
      style: {
        fontWeight: 'bold',
        fontSize: 'large',
        textAlign: 'center'
      },
    },
    // {
    //   when: row => row.criticalValue === row.totalQuantity ,
    //   style: {
    //     backgroundColor: orange, // Light blue for Admin
    //     fontWeight: 'bold',
    //     fontSize:'large'
    //   },
    // },



  ];

  // Header styling to make header text bold
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: 'larger',
        // textAlign: 'start'
      },
    }
  };

  // const customStyles = {
  //   cells: [
  //     {
  //       style: (row, rowIndex, columnIndex) => {
  //         if (columnIndex === 0) return { backgroundColor: '#e0f7fa' }; // Light blue for first column
  //         if (columnIndex === 1) return { backgroundColor: '#ffebee' }; // Light red for second column
  //         if (columnIndex === 2) return { backgroundColor: '#fff3e0' }; // Light orange for third column
  //       }
  //     }
  //   ],
  // };


  return (
    <div className='w-100 h-100' >
      <h1> ادارة الاصناف   {isLoading && <Spinner />} </h1>

      <button className='btn btn-success' onClick={() => {
        navigate('/allitems/add');
      }} > اضافة <BsPlus /> </button>

      <AlarmComponent />
      <SearchItemsComponent setIsLoading={setIsLoading} setCategories={setCategories} />

      {
        categories?.length > 0 && <DataTable
          columns={columns}
          data={categories}
          filter={true}
          filterPlaceholder={'ابحث هنا'}
          conditionalRowStyles={conditionalRowStyles}
          customStyles={customStyles}
          pagination
        />
      }

      {
        showExpirationDatesModal && <ExpirationDatesModal
          show={showExpirationDatesModal} setShow={setShowExpirationDatesModal}
          category={categoryToShow} setCategory={setCategoryToShow}
        />
      }

    </div>
  )
}
