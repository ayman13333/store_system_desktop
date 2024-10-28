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
    { name: 'الحد الحرج', selector: row => row.criticalValue, sortable: true },
    { name: 'الوحدة', selector: row => row.unit, sortable: true },
    {
      name: 'تاريخ الصلاحية',
      cell: (row) => <button
        onClick={() => {
            setCategoryToShow(row);
            setShowExpirationDatesModal(true);
        }}
        className='btn btn-secondary' style={{
          whiteSpace:'nowrap'
        }} > اضغط هنا  <CiEdit /> </button>,
      sortable: true
    },
    { name: 'الكمية', selector: row => row.totalQuantity, sortable: true },
    { name: 'سعر الوحدة', selector: row => row.unitPrice, sortable: true },
    { name: 'الاجمالي', selector: row => Number(row?.unitPrice * row?.totalQuantity), sortable: true },
    {
      name: 'تعديل',
      cell: (row) => <button className='btn btn-warning' onClick={() => {
         
      }}
      style={{
        whiteSpace:'nowrap'
      }}
      > تعديل  <CiEdit /> </button>
  }

  ];

  const conditionalRowStyles = [
    {
      when: row => true, // Apply to all rows
      style: {
        fontWeight: 'bold',
        fontSize:'large'
      },
    },
    {
      when: row => row.criticalValue === row.totalQuantity ,
      style: {
        backgroundColor: orange, // Light blue for Admin
        fontWeight: 'bold',
        fontSize:'large'
      },
    },
    // {
    //   when: row => row._id === "67179c2d08c1baf43d1ce7c7",
    //   style: {
    //     backgroundColor: yellow, // Light red for User
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
      fontSize:'larger'
    },
  },
};


  return (
    <div className='w-100 h-100' >
      <h1> ادارة الاصناف   {isLoading && <Spinner />} </h1>

      <button className='btn btn-success' onClick={() => {
        navigate('/allitems/add');
      }} > اضافة <BsPlus /> </button>

      <AlarmComponent />
      <SearchItemsComponent setIsLoading={setIsLoading} setCategories={setCategories} />

     {
      categories?.length >0 && <DataTable
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
