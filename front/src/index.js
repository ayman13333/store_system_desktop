import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
 import './index.css';
 import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import "./App.css";

export const MyContext = createContext();

const RootComponent =()=>{
  // الجهات
     const [entities, setEntities] = useState(null);
     const[isLogin,setIsLogin]=useState(false);


     const contextValue = {
      entities,
      setEntities,
      isLogin,setIsLogin
    //  changeName: (newName) => setName(newName),
    };

    return(
      <MyContext.Provider value={contextValue}>
      <App />
    </MyContext.Provider>
    );

}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Create the context



// root.render(
//   <MyContext.Provider value={contextValue}>
//     <App />
//   </MyContext.Provider>
// );

root.render(<RootComponent />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
