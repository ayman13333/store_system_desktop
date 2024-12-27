import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { BsBackspaceFill, BsPlus } from "react-icons/bs";
import { CiEdit, CiLock, CiUnlock } from "react-icons/ci";
import { toast } from "react-toastify";
import { FiRefreshCcw } from "react-icons/fi";

export default function AllGuestsComponent() {
  const [users, setUsers] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // معلومات المستخدم
  const [fullName, setFullName] = useState('');
  const [type, setType] = useState(0);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [userForEdit, setUserForEdit] = useState(null);
  const [typeOfSupply, setTypeOfSupply] = useState('');
  const [advantages, setAdvantages] = useState('');
  const [disAdvantages, setDisAdvantages] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const[serialNumber,setSerialNumber]=useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showEditModal == false) {
      setSearchValue('');
      setFullName('');
      setType(0);
      setMobile('');
      setAddress('');
    }
  }, [showEditModal])

  useEffect(() => {
    const get = async () => {
      setIsLoading(true);
      const result = await window?.electron?.getAllUsers({
        type: 'allSuppliers'
      });
      setIsLoading(false);
      
      console.log('result', result);

      setUsers(result?.users);
    }

   
    get();
    
  }, []);

  const search = () => {
    console.log("searchValue", searchValue);
    // prev?.fullName.includes(searchValue)
    setUsers((prev) =>
      prev.filter(el => el?.fullName.includes(searchValue) ? el : '')
    );
  }

  const cancelFilter = async () => {
    setIsLoading(true);
    const result = await window?.electron?.getAllUsers({
      type: 'allSuppliers'
    });
    setIsLoading(false);

    console.log('result', result);

    setUsers(result?.users);
    setSearchValue('');
  }

  const addOrEditUser = async () => {

    if(fullName=='') return toast.error("من فضلك   ادخل الاسم رباعي"); 
    if (type == 0) return toast.error("من فضلك   اختر نوع التوريد");
    let data = {
      type
    };


    if (type == 'consumer' || type == 'transfer') data.fullName = fullName;

    else {
      if (taxNumber == '') return toast.error("من فضلك   ادخل الرقم الضريبي");
      if (fullName == '') return toast.error("من فضلك ادخل الاسم رباعي");
      if (mobile == '') return toast.error("من فضلك   ادخل الهاتف");
      if (serialNumber == '') return toast.error("من فضلك   ادخل الرقم القومي");

      // serialNumber
      data = {
        fullName,
        type,
        mobile,
        address,
        advantages,
        disAdvantages,
        typeOfSupply,
        taxNumber,
        serialNumber
      };
    }



    console.log('isEdit', isEdit);

    if (isEdit) {
      data._id = userForEdit?._id;
    }

    // else data.typeOfUser = 'user';

    if (isEdit) {
      setIsLoading(true);
      let result = await window?.electron?.editGuest(data);
      setIsLoading(false);

      if (result?.success) {
        const usersAfterEdit = await window?.electron?.getAllUsers({
          type: 'allSuppliers'
        });

        setUsers(usersAfterEdit?.users);

        setSearchValue('');
        setShowEditModal(false);
        setFullName('');
        // setCardNumber('');
        setType(0);
        setMobile('');
        setAddress('');
        setUserForEdit(null);

        setTypeOfSupply('');
        setAdvantages('');
        setDisAdvantages('');
        setTaxNumber('');
        setSerialNumber('');

        setIsEdit(false);

        console.log('result', result);
      }
    }
    else {
      console.log('adddddddddddddd');
      console.log('data', data);
      setIsLoading(true);
      // checks
      let result = await window?.electron?.addUser(data);
      setIsLoading(false);

      if (result?.newUser?._id) {
        const usersAfterEdit = await window?.electron?.getAllUsers({
          type: 'allSuppliers'
        });

        setUsers(usersAfterEdit?.users);

        setSearchValue('');
        setShowEditModal(false);
        setFullName('');
        //  setCardNumber('');
        setType(0);
        setMobile('');
        setAddress('');
        setUserForEdit(null);

        setTypeOfSupply('');
        setAdvantages('');
        setDisAdvantages('');
        setTaxNumber('');
        setSerialNumber('');

        setIsEdit(false);
      }

    }


  }

  const columns = [
    {
      name: 'الاسم',
      selector: row => row.fullName,
      sortable: true,
    },
    {
      // madany
      // army
      // darMember
      name: 'النوع',
      selector: row => {
        if (row.type == 'supplier') return 'مورد';
        if (row.type == 'consumer') return 'جهة صرف';
        if (row.type == 'transfer') return 'جهة تحويل';


      },
      sortable: true,
    },
    {
      name: 'تعديل',
      cell: (row) => <button
        onClick={() => {
          setUserForEdit(row);
          // console.log("row", row);
          setFullName(row?.fullName);
          // setCardNumber(row?.cardNumber);
          setType(row?.type);
          setMobile(row?.mobile);
          setAddress(row?.address);

          setTypeOfSupply(row?.typeOfSupply);
          setAdvantages(row?.advantages);
          setDisAdvantages(row?.disAdvantages);
          setSerialNumber(row?.serialNumber ? row?.serialNumber : '');

          setTaxNumber(row?.taxNumber ? row?.taxNumber : '');
          
          setShowEditModal(true);
          setIsEdit(true);
        }}
        className='btn btn-warning' > تعديل  <CiEdit /> </button>
    },
    {
      name: 'الحالة',
      cell: (row) => <button
        onClick={ async() => {
        

          let data={
          _id:row?._id,
          status:!row?.status
          };

          console.log('data',data);
        //  return;

          setIsLoading(true);
          let result = await window?.electron?.editGuest(data);
          setIsLoading(false);
    
          if (result?.success) {
            const usersAfterEdit = await window?.electron?.getAllUsers({
              type: 'allSuppliers'
            });
    
            setUsers(usersAfterEdit?.users);
    
            // setSearchValue('');
            // setShowEditModal(false);
            // setFullName('');
            // // setCardNumber('');
            // setType(0);
            // setMobile('');
            // setAddress('');
            // setUserForEdit(null);
    
            // setTypeOfSupply('');
            // setAdvantages('');
            // setDisAdvantages('');
            // setTaxNumber('');
    
            // setIsEdit(false);
    
            console.log('result', result);
          }
     
          
        }}
        className={`btn ${row?.status==true ? 'btn-success' : 'btn-danger'}`}
        style={{width:'114px'}}
         >{row?.status==true ? 'غير محظور' : 'محظور'}   <CiLock /> </button>
    }
  ];
  console.log('users', users);
  //-------------------------------------------
  const handleWheel = (event) => {
    // event.preventDefault();
    // Optionally blur the input to remove focus and further prevent interaction
    event.currentTarget.blur();
  };
  //-------------------------------------------


  // const onKeyEnter = (event)=>{
  //   if( event.key == "Enter"){
  //     if(fullName !=="" &&mobile !=="" &&cardNumber !=="" &&address !=="" && type !==0 ){
  //       addOrEditUser();
  //     }

  //   }
  // }
  // const onKeyEnter2 = (event)=>{
  //   if( event.key == "Enter"){
  //       search();


  //   }
  // }

  return (
    <div className='w-100 h-100'>
      {
        showEditModal && <>
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header>
              <Modal.Title>
                {isEdit ? ' تعديل جهة' : 'اضافة جهة'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div className="form-group">
                <label className="my-2"> النوع</label>
                <select

                  value={type} onChange={(e) => setType(e.target.value)}

                  className="form-control">
                  <option value={0}> من فضلك النوع </option>
                  <option value={'consumer'}> جهة صرف </option>
                  <option value={'supplier'}>  مورد </option>
                  <option value={'transfer'}>  جهة تحويل </option>

                </select>
              </div>

              {
                (type == 'consumer' || type == 'transfer') ?
                  <div className="form-group">
                    <label className="my-2"> الاسم رباعي </label>
                    <input
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      type="text" className="form-control" placeholder=" الاسم رباعي" />
                  </div>
                  :
                  type != '0' &&
                  <>
                    <div className="form-group">
                      <label className="my-2"> الرقم الضريبي </label>
                      <input
                        value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)}
                        type="number" className="form-control" placeholder=" الرقم الضريبي" onWheel={handleWheel} />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> الرقم القومي </label>
                      <input
                        value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
                        type="number" className="form-control" placeholder=" الرقم القومي" onWheel={handleWheel} />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> الاسم رباعي </label>
                      <input
                        value={fullName} onChange={(e) => setFullName(e.target.value)}
                        type="text" className="form-control" placeholder=" الاسم رباعي" />
                    </div>


                    <div className="form-group">
                      <label className="my-2"> رقم الموبايل </label>
                      <input
                        value={mobile} onChange={(e) => setMobile(e.target.value)}
                        type="number" className="form-control" placeholder=" رقم الموبايل" onWheel={handleWheel} />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> العنوان </label>
                      <input
                        value={address} onChange={(e) => setAddress(e.target.value)}
                        type="text" className="form-control" placeholder=" العنوان" />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> نوع التوريد </label>
                      <input
                        value={typeOfSupply} onChange={(e) => setTypeOfSupply(e.target.value)}
                        type="text" className="form-control" placeholder=" نوع التوريد" />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> المميزات </label>

                      <Form.Control as="textarea"
                        value={advantages} onChange={(e) => setAdvantages(e.target.value)}
                        placeholder=" المميزات"
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="my-2"> العيوب </label>

                      <Form.Control as="textarea"
                        value={disAdvantages} onChange={(e) => setDisAdvantages(e.target.value)}
                        placeholder=" المميزات"
                        rows={3}
                      />
                    </div>
                  </>
              }

              <div className="d-flex my-3 justify-content-between">
                <Button
                  onClick={() => addOrEditUser()}
                  variant="primary" >
                  حفظ
                </Button>

                <Button className="gap-2" variant="secondary" onClick={() => {
                  setShowEditModal(false);
                }}>
                  اغلاق
                </Button>
              </div>



            </Modal.Body>
          </Modal>
        </>
      }


      <h1 style={{background:"#b9d5fd", padding:"10px", border:"2px solid #c1c1c1", width:"230px" }}> ادارة الجهات  {
        isLoading && <Spinner />
      } </h1>

      <div className="d-flex justify-content-between my-3">
        <button onClick={() => {
          setShowEditModal(true);
          setIsEdit(false);
        }} className='btn btn-success' > اضافة <BsPlus /> </button>


        <div className="d-flex gap-2">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="form-control"
            placeholder="ابحث بالاسم هنا"
          />

          <button onClick={() => search()} className='btn btn-success'> بحث </button>
        </div>

        <button onClick={() => cancelFilter()}style={{width: '80px'}} className='btn btn-danger' > <FiRefreshCcw size={'24px'}/> </button>
      </div>

      {
        users &&
        <DataTable
          columns={columns}
          data={users}
          filter={true}
          filterPlaceholder={'ابحث هنا'}

          pagination
        />
      }
    </div>
  )
}
