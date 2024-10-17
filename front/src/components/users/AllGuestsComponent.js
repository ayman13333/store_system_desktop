import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { BsBackspaceFill, BsPlus } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

export default function AllGuestsComponent() {
  const [users, setUsers] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // معلومات المستخدم
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [type, setType] = useState(0);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [userForEdit, setUserForEdit] = useState(null);


  const [isEdit, setIsEdit] = useState(false);
  useEffect(()=>{
    if(showEditModal==false){
      setSearchValue('');
      setFullName('');
      setCardNumber('');
      setType(0);
      setMobile('');
      setAddress('');
    }
},[showEditModal])

  useEffect(() => {
    const get = async () => {
      const result = await window?.electron?.getAllUsers({
        type: 'guests'
      });
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
    const result = await window?.electron?.getAllUsers({
      type: 'guests'
    });
    console.log('result', result);

    setUsers(result?.users);
    setSearchValue('');
  }

  const addOrEditUser = async () => {
    if (type == 0) return toast.error("من فضلك اختر تصنيف العميل");

    let data = {
      fullName,
      cardNumber,
      type,
      mobile,
      address
    };

    console.log('isEdit', isEdit);

    if (isEdit) {
      data._id = userForEdit?._id;
      data.oldCardNumber = userForEdit?.cardNumber;
    }
    else data.typeOfUser = 'user';

    if (isEdit) {
      let result = await window?.electron?.editGuest(data);
      if (result?.success) {
        const usersAfterEdit = await window?.electron?.getAllUsers({
          type: 'guests'
        });

        setUsers(usersAfterEdit?.users);

        setSearchValue('');
        setShowEditModal(false);
        setFullName('');
        setCardNumber('');
        setType(0);
        setMobile('');
        setAddress('');
        setUserForEdit(null);
        setIsEdit(false);

        console.log('result', result);
      }
    }
    else {
      console.log('adddddddddddddd');
      let result = await window?.electron?.addUser(data);

      if (result?.newUser?._id) {
        const usersAfterEdit = await window?.electron?.getAllUsers({
          type: 'guests'
        });

        setUsers(usersAfterEdit?.users);

        setSearchValue('');
        setShowEditModal(false);
        setFullName('');
        setCardNumber('');
        setType(0);
        setMobile('');
        setAddress('');
        setUserForEdit(null);
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
        if (row.type == 'madany') return 'مدني';
        if (row.type == 'army') return 'قوات مسلحة';
        if (row.type == 'darMember') return 'عضو دار';

      },
      sortable: true,
    },
    {
      name: 'الهاتف',
      selector: row => row.mobile,
      sortable: true,
    },

    {
      name: 'تعديل',
      cell: (row) => <button
        onClick={() => {
          setUserForEdit(row);
          // console.log("row", row);
          setFullName(row?.fullName);
          setCardNumber(row?.cardNumber);
          setType(row?.type);
          setMobile(row?.mobile);
          setAddress(row?.address);
          setShowEditModal(true);
          setIsEdit(true);
        }}
        className='btn btn-warning' > تعديل  <CiEdit /> </button>
    }
  ];
  console.log('users', users);
  //-------------------------------------------
const handleWheel = (event) => {
  // event.preventDefault();
  // Optionally blur the input to remove focus and further prevent interaction
  event.currentTarget.blur();};
//-------------------------------------------


const onKeyEnter = (event)=>{
  if( event.key == "Enter"){
    if(fullName !=="" &&mobile !=="" &&cardNumber !=="" &&address !=="" && type !==0 ){
      addOrEditUser();
    }
  
  }
}
const onKeyEnter2 = (event)=>{
  if( event.key == "Enter"){
      search();
    
  
  }
}

  return (
    <div className='w-100 h-100'>
      {
        showEditModal && <>
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header>
              <Modal.Title>
                {isEdit ? ' تعديل عميل' : 'اضافة عميل'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={(e) => {
                e.preventDefault();
                addOrEditUser();
              }}>
                <div className="form-group">
                  <label className="my-2"> الاسم رباعي </label>
                  <input
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    required
                    onKeyPress={onKeyEnter}
                    type="text" className="form-control" placeholder=" الاسم رباعي" />
                </div>

                <div className="form-group">
                  <label className="my-2"> رقم تحقيق الشخصية </label>
                  <input
                    value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                    required
                    onKeyPress={onKeyEnter}
                    type="number" className="form-control" placeholder=" رقم تحقيق الشخصية" onWheel={handleWheel} />
                </div>

                <div className="form-group">
                  <label className="my-2">تصنيف العميل</label>
                  <select

                    value={type} onChange={(e) => setType(e.target.value)}
                    required
                    onKeyPress={onKeyEnter}
                    className="form-control">
                    <option value={0}> من فضلك اختر تصنيف العميل </option>
                    <option value={'madany'}> مدني </option>
                    <option value={'army'}> قوات مسلحة </option>
                    <option value={'darMember'}> عضو دار </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="my-2"> رقم الموبايل </label>
                  <input
                    value={mobile} onChange={(e) => setMobile(e.target.value)}
                    required
                    onKeyPress={onKeyEnter}
                    type="number" className="form-control" placeholder=" رقم الموبايل" onWheel={handleWheel} />
                </div>

                <div className="form-group">
                  <label className="my-2"> العنوان </label>
                  <input
                    value={address} onKeyPress={onKeyEnter} onChange={(e) => setAddress(e.target.value)}
                    type="text" className="form-control" placeholder=" العنوان" />
                </div>



                <div className="d-flex my-3 justify-content-between">
                  <Button type="submit" variant="primary" >
                    حفظ
                  </Button>

                  <Button className="gap-2" variant="secondary" onClick={() => {
                    setShowEditModal(false);
                  }}>
                    اغلاق
                  </Button>
                </div>


              </form>
            </Modal.Body>
          </Modal>
        </>
      }

      <h1> ادارة العملاء </h1>

      <div className="d-flex justify-content-between my-3">
        <button onClick={() => setShowEditModal(true)} className='btn btn-success' > اضافة <BsPlus /> </button>

        <div className="d-flex gap-2">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="form-control"
            placeholder="ابحث بالاسم هنا"
            onKeyPress={onKeyEnter2}
            />

          <button onClick={() => search()} className='btn btn-success'> بحث </button>
        </div>

        <button onClick={() => cancelFilter()} className='btn btn-danger' > الغاء الفلتر <BsBackspaceFill /> </button>
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
