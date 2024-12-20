import React, { useEffect, useState } from 'react'
import { Badge, Button, ListGroup, Offcanvas } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';

export default function NavBar() {
    const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    // getNotifications
    const get=async()=>{
        const result=await  window?.electron?.getNotifications();

        if(result?.success) setNotifications(result?.notifications)
    }

    get();
  },[]);

  console.log('notifications',notifications);
    const handleButtonClick = () => {
        alert("Opening notifications...");
        // Reset notifications or handle them
        setNotifications(0);
      };

     // Toggle the notification bar
  const handleToggle = () => setShow(!show);

  // Clear notifications (optional)
  const handleClearNotifications = () => setNotifications([]);
    // const location = useLocation();
    // console.log('location',location.pathname);

  return (
    <div className='d-flex justify-content-end p-2' style={{backgroundColor: '#212529',color:'white',height:'70px'}}>
        {/* <Button  onClick={handleButtonClick}> */}
        
      
      <div style={{marginTop:'10px',cursor:'pointer'}} onClick={()=>handleToggle()}>
          <FaBell size={'lg'}  />
        </div>
        <Badge text="white" style={{height:'20px',borderRadius:'13px'}}>
         <div > {notifications?.length} </div>
      </Badge>
    {/* </Button> */}

    {/* Notification Bar */}
    <Offcanvas  show={show} onHide={handleToggle} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{width:'94%'}}> الاشعارات</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {notifications.length > 0 ? (
            <>
              {/* List of Notifications */}
              <ListGroup>
                {notifications.map((notification, index) => (
                  <ListGroup.Item className='notification' key={index} style={{fontWeight:'bold',cursor:'pointer'}}>
                    {notification?.title}
                    </ListGroup.Item>
                ))}
              </ListGroup>
              {/* <Button
                variant="danger"
                className="mt-3"
                onClick={handleClearNotifications}
              >
                مسح الاشعارات
              </Button> */}
            </>
          ) : (
            <p>No new notifications!</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
