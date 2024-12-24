import { Button, Modal } from "react-bootstrap";
import FormatDate from "../../../Utilities/FormatDate";
import FormatDateForHTML from "../../../Utilities/FormatDateForHTML";

export default function Expiration2({ show, setShow , category , setCategory,type='' }) {

    console.log('type',type);
    
    return (
        <Modal show={show} onHide={() =>{
            setCategory(null);
            setShow(false);
        } }>
            <Modal.Header>
                <Modal.Title style={{
                    lineBreak:'anywhere'
                }}>
                     {`الصنف : ${category?.name}`}
                    {/* {isEdit ? ' تعديل موظف' : 'اضافة موظف'} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <div className=''>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                               {type=='' && <th >تاريخ انتهاء الصلاحية</th>} 
                                <th className="text-center" >الكمية</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                category?.expirationDatesArr?.map((el, i) =>{
                                    const date = new Date(el?.date);

                                    return(
                                        <tr key={i}>
                                      {type=='' && <td>{FormatDateForHTML(date)} </td>}  
                                        <td className="text-center" >{el?.quantity}</td>
                                    </tr>
                                    )
                                }
                                   
                                )
                            }

                        </tbody>
                    </table>
            </div>

               
                <div className="d-flex my-3 justify-content-between">

                    {/* <Button onClick={() => {
                        if (rowToEdit == null) addRow();
                        else editRow();
                    }} variant="primary" >
                        حفظ
                    </Button> */}

                    <Button className="gap-2" variant="secondary" onClick={() => {
                        setShow(false);
                        setCategory(null);

                    }}>
                        اغلاق
                    </Button>
                </div>

            </Modal.Body>

        </Modal>
    )
}
