import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { BsPlus } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import Notify from "../../Utilities/notify";
import { toast } from "react-toastify";
//import { notify } from 'react-notify-toast';


export default function AllUsersComponent() {
    const [users, setUsers] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userID, setUserID] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [type, setType] = useState(0);
    const[isLoading,setIsLoading]=useState(false);
   
    useEffect(()=>{
        if(showModal==false){
            setEmail('')
            setPassword('')
            setUserID('')
            setType(0)
        }
    },[showModal])
    // getAllUsers
    useEffect(() => {
        const get = async () => {
            setIsLoading(true);
            const result = await window?.electron?.getAllUsers({
                type: 'worker'
            });
            setIsLoading(false);
            console.log('result', result);
            // setIsLoading(true);
            setUsers(result?.users);
            
        }

        get();
    }, []);

    console.log('users', users);

    const addOrEditUser = async () => {

        if (type == 0) {
            return toast.error("من فضلك اختر تصنيف الموظف");
        }

        let data = {
            lastEmail: userID?.email,
            email,
            password,
            type
            // mobile,
            // address
        };

        if (userID) data._id = userID?._id;
        // let result='';
        // edit
        if (isEdit) {
            console.log('eeeeeeeeeeeeeee');
            console.log(data);
            
            setIsLoading(true);
            await window?.electron?.editUser(data);
            const result = await window?.electron?.getAllUsers({
                type: 'worker'
            });
            setIsLoading(false);

            console.log('result', result);

            setUsers(result?.users);
            setIsEdit(false);
            setUserID('');
            setShowModal(false);
            setType(0);
        }
        else {
           
            setIsLoading(true);

            console.log('data',data);

            // add
            await window?.electron?.addUser(data);

            console.log('afterrrrr');
            const result = await window?.electron?.getAllUsers({
                type: 'worker'
            });
            setIsLoading(false);
            
            console.log('result', result);

            setUsers(result?.users);
            setShowModal(false);
            setType(0);
        }

        setEmail('');
        setPassword('');
       
    }
const onKeyEnter = (event)=>{
   if( event.key == "Enter"){
    if(email !==""&&password !==""&&type !==0){
        addOrEditUser();
    }
   }
}
    const columns = [
        {
            name: 'الاميل',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'النوع',
            selector: row =>{
                if(row.type=='worker') return 'موظف';
                if(row.type=='storekeeper') return 'امين مخزن';
                if(row.type=='admin') return 'ادمن';

            } ,
            sortable: true,
        },
        // {
        //   name: 'مدني',
        //   selector: row => row.priceForUser,
        //   sortable: true,
        // },
        // {
        //   name: 'قوات مسلحة',
        //   selector: row => row.priceForArmy,
        //   sortable: true,
        // },
        // {
        //   name: 'عضو الدار',
        //   selector: row => row.priceForDarMember,
        //   sortable: true,
        // },
        {
            name: 'تعديل',
            cell: (row) => <button className='btn btn-warning' onClick={() => {
                setEmail(row.email);
                setShowModal(true);
                setIsEdit(true);
                setUserID(row);
                setType(row?.type);
            }}> تعديل  <CiEdit /> </button>
        }
    ];


    return (
        <div className='w-100 h-100'>
            {
                showModal && <>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header>
                            <Modal.Title>
                                {isEdit ? ' تعديل موظف' : 'اضافة موظف'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                addOrEditUser();
                            }}>
                                <div className="form-group">
                                    <label className="my-2"> الاميل </label>
                                    <input
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="text" className="form-control" placeholder=" الاميل"
                                        onKeyPress={onKeyEnter}

                                        />
                                </div>

                                <div className="form-group">
                                    <label className="my-2"> الرقم السري </label>
                                    <input
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        required
                                        type="text" className="form-control" placeholder=" الرقم السري"
                                        onKeyPress={onKeyEnter}
                                        />
                                </div>

                                <div className="form-group">
                                    {
                                         <>
                                            <label className="my-2">  تصنيف الموظف </label>

                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="form-control"
                                                onKeyPress={onKeyEnter}

                                            >
                                                <option value={0}> اختر تصنيف الموظف  </option>
                                                <option value={'admin'}> ادمن  </option>
                                                <option value={'worker'}> موظف  </option>
                                                <option value={'storekeeper'}>  امين مخزن </option>
                                            </select></>
                                    }

                                </div>

                                {isLoading&&<Spinner />}

                                <div className="d-flex my-3 justify-content-between">
                                    {
                                        isEdit ?
                                            <Button type="submit" variant="warning" >
                                                تعديل
                                            </Button>
                                            :
                                            <Button type="submit" variant="primary" >
                                                حفظ
                                            </Button>
                                    }



                                    <Button className="gap-2" variant="secondary" onClick={() => {
                                        setShowModal(false);
                                     
                                    }}>
                                        اغلاق
                                    </Button>
                                </div>


                            </form>
                        </Modal.Body>
                    </Modal>
                </>
            }
            <h1> ادارة الموظفين   {isLoading&&<Spinner />} </h1>

           

            <button className='btn btn-success my-2' onClick={() => {
                setShowModal(true);
                setIsEdit(false);
                setUserID('');
            }} > اضافة <BsPlus /> </button>
            {
                users &&
                <DataTable
                    // title="Arnold Movies"
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
