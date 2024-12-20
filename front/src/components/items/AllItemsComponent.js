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
import FormatDate from "../../Utilities/FormatDate";
import { TbHandClick } from "react-icons/tb";

export default function AllItemsComponent() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
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
      setOriginalCategories(result?.categories);
    }

    get();
  }, []);

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  console.log('loggedUser',loggedUser);
  // if (str.length > maxLength) {
  //   return str.substring(0, maxLength) + '...';
  // }

  let columns = [
    {
      name: 'الكود',
      sortable: true,
      cell: row =>{
        let codeStr;

          if(row?.code?.length >10){
              codeStr=row.code.substring(0, 10) + '...';
          }
          else codeStr=row.code;

        return(
          <div style={{  textAlign: 'start',whiteSpace:'nowrap',textOverflow: 'ellipsis',
            width:'100%'
           }}>
            {codeStr}
          </div>
        )
      } 
    },
    { name: 'الاسم',
      cell: row =>{
        let codeStr;

        if(row?.name?.length >7){
            codeStr=row?.name.substring(0, 10) + '...';
        }
        else codeStr=row?.name;
        return(
          <div style={{
           textAlign: 'start',whiteSpace:'nowrap',width:'100%' }}>
            {codeStr}
          </div>
        )
      } , 
      sortable: true },
    {
      name: 'الحد الحرج',
      selector: row => row.criticalValue,
      sortable: true
    },
    { name: 'الوحدة', selector: row => row.unit, sortable: true },
    {
      name: ' الصلاحية',
      cell: (row) => {
        const currentDate = new Date();
        let isYellow = false;
        let isRed = false;
        let yellowCount = 0;

        row?.expirationDatesArr?.map(el => {
          const itemDate = new Date(el?.date);
          if (currentDate.getTime() > itemDate.getTime()) {
            isYellow = true;
            yellowCount++;
          }
        });

        if (yellowCount == row?.expirationDatesArr?.length) isRed = true;

        let color = '';
        if (isRed == true) color = red;
        else {
          if (isYellow) color = yellow;
        }
        return (
          <div style={{  width: '100%' }} >
            <button
              onClick={() => {
                setCategoryToShow(row);
                setShowExpirationDatesModal(true);
              }}
              className={`btn ${(isYellow==true && isRed==false) ?'btn-danger' : 'btn-secondary'} py-1`}  style={{
                whiteSpace: 'nowrap',
                width: '80%'
              }} > <TbHandClick height={'5px'} />  </button>
          </div>
        )
      }
      ,
      sortable: true
    },
    { name: 'الكمية', selector: row => parseFloat(row.totalQuantity).toFixed(2), sortable: true },
    { name: 'سعر الوحدة', selector: row => parseFloat(row.unitPrice).toFixed(2), sortable: true },
    { name: 'الاجمالي', selector: row => parseFloat(Number(row?.unitPrice * row?.totalQuantity)).toFixed(2), sortable: true },
    // {
    //   name:'اسم الموظف',
    //   selector:row=>row?.user?.email
    // },
    // {
    //   name:'تاريخ التعديل',
    //   selector:row=> row?.editDate ?FormatDate(new Date(row?.editDate)) : ''
    // },
    {
      name: 'تعديل',
      cell: (row) => <button className={`${row?.user?._id ?'btn-primary' : 'btn-secondary'} btn  py-1`} onClick={() => {
        //  console.log('row',row);
        navigate('/allitems/edit', {
          state: row
        });
      }}
        style={{
          whiteSpace: 'nowrap'
        }}
      > تعديل  <CiEdit /> </button>
    }

  ];

  if(loggedUser?.type=="storekeeper"){
    columns=columns?.filter(el=>el?.name!='تعديل' && el?.name!='الحد الحرج' && el?.name!='سعر الوحدة' && el?.name!='الاجمالي' );
  }

  const conditionalRowStyles = [
    {
      when: row => true, // Apply to all rows
      style: {
         fontWeight: 'bold',
        fontSize: 'large',
        textAlign: 'center',

      },
    },
     {
      when: row => {
        const currentDate = new Date();
        let isYellow = false;
        let isRed = false;
        let yellowCount = 0;

        row?.expirationDatesArr?.map(el => {
          const itemDate = new Date(el?.date);
          if (currentDate.getTime() > itemDate.getTime()) {
            isYellow = true;
            yellowCount++;
          }
        });

        if (yellowCount == row?.expirationDatesArr?.length) {
          return true;
          //  isRed=true;

        }

      },
      style: {
        backgroundColor: red,
         fontWeight: 'bold',
         fontSize: 'large',
        textAlign: 'center',
      }
    },
    {
      when: row => {
        const currentDate = new Date();
        let isYellow = false;
        let isRed = false;
        let yellowCount = 0;

        row?.expirationDatesArr?.map(el => {
          const itemDate = new Date(el?.date);
          if (currentDate.getTime() > itemDate.getTime()) {
            isYellow = true;
            yellowCount++;
          }
        });

        if (yellowCount == row?.expirationDatesArr?.length) {
          return true;
          //  isRed=true;

        }

      },
      style: {
        backgroundColor: red,
         fontWeight: 'bold',
         fontSize: 'large',
        textAlign: 'center',
      }
    },
    {
      when: row => {
        const currentDate = new Date();
        let isYellow = false;
        let isRed = false;
        let yellowCount = 0;

        row?.expirationDatesArr?.map(el => {
          const itemDate = new Date(el?.date);
          if (currentDate.getTime() > itemDate.getTime()) {
            isYellow = true;
            yellowCount++;
          }
        });

        if ((yellowCount != row?.expirationDatesArr?.length) && yellowCount > 0) return true

        if(row.criticalValue >= row.totalQuantity){
          return true 
        }
        // row.criticalValue === row.totalQuantity ?  true : false;

      },
      style: {
        backgroundColor:  yellow,
         fontWeight: 'bold',
        fontSize: 'large',
        textAlign: 'center',
      }
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

    console.log('categories',categories);
    
  return (
    <div className='w-100 h-100' >
      <h1> ادارة الاصناف   {isLoading && <Spinner />} </h1>
      {
        loggedUser?.type!="storekeeper" &&<button className='btn btn-success my-2' onClick={() => {
          navigate('/allitems/add');
        }} > اضافة <BsPlus /> </button>
      }
      

      <AlarmComponent />
      <SearchItemsComponent setIsLoading={setIsLoading} setCategories={setCategories} originalCategories={originalCategories} />

      {
        !isLoading && <DataTable
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
