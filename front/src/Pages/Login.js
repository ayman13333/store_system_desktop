import { useEffect, useState } from "react";
import logo from "../images/logo.jpg";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";


export default function Login({setIsLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[isLoading,setIsLoading]=useState(false);

    useEffect(()=>{
        setIsLogin(false);
    },[])

    const navigate=useNavigate();

    const login=async()=>{

       // navigate('/allitems');

        //  login
        const data={
            email:email.trim(),
            password : password.trim()
        }
        setIsLoading(true);
      //  await window?.electron?.postNewNotifications();

        let result = await window?.electron?.login(data);

        setIsLoading(false);

        // localStorage.setItem('type','admin');

    //  return   navigate('/allitems');


        if(result?.success){
            localStorage.setItem('type',result?.user.type);
            localStorage.setItem('email',result?.user.email);

            let loggedUser=localStorage.setItem('user',JSON.stringify(result?.user));

            // if(result?.user.type=='accountant') navigate('/accountant/search');
            // else navigate('/allitems');
            setIsLogin(true);
            navigate('/allitems');
           // window.location.href='/allitems';
        }

        console.log("result",result);
    }

    console.log('ppppppppppppppppppppppppppp');
    
    return (
        <div className="d-flex justify-content-center parent" style={{
            height: '100vh',
            alignItems: 'center',
            flexDirection: 'column'
        }}>


            <img src={logo} alt="" style={{height:"300px"}} />
            <form
            className="w-100 d-flex justify-content-center flex-column"
             onSubmit={(e)=>{
                e.preventDefault();
                login();
            }}>
                <div className="d-flex justify-content-center flex-column" style={{
                    alignItems:'center'
                }}>
                <div className="form-group w-50 items-center">
                    <label className="my-2">  الأيميل </label>
                    <input
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                        type="text" className="form-control" placeholder="الأيميل" />
                </div>

                <div className="form-group w-50">
                    <label className="my-2">  كلمة المرور </label>
                    <input
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password" className="form-control" placeholder="كلمة المرور" />
                </div>

                <div className="form-group w-50 my-3">
                    <button type="submit" className="btn btn-success w-100">
                        {isLoading&&<Spinner />} 
                        تسجيل الدخول 
                        </button>
                </div>
                </div>
             
            </form>

        </div>
    )
}
