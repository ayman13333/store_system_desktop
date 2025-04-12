import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function RegenerateInvoicesCodeModal({show,setShow}) {

    const[invoiceType,setInvoiceType]=useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const confirm=async()=>{
        try {
            if(invoiceType=='') return toast.error(' من فضلك اختر نوع الفاتورة');

            const data={
                invoiceType
            };

            setIsLoading(true);
           const result= await window?.electron?.regenerateInvoiceCodes(data);

            if (result.success == true)  toast.success('تم تعديل الاكواد بنجاح');

        } catch (error) {
            return toast.error('حاول مرة اخري');
        }
        finally{
            setIsLoading(false);

            setShow(false);
        }
    }
  return (
    <Modal show={show} onHide={() => {
                setShow(false);
            }}>
                <Modal.Header >
                    <Modal.Title>
                       اختر نوع الفاتورة
                        
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <select
                         value={invoiceType}
                         onChange={(e) => setInvoiceType(e.target.value)}
                        className="form-control">
                        <option value={'0'}> اختر نوع الفاتورة </option>
                        <option value={'payment'}> صرف </option>
                        <option value={'supply'}> توريد </option>
                        <option value={'convert'}> تحويل </option>
                    </select>
                </Modal.Body>
    
                <Modal.Footer>
                    <div className="d-flex justify-content-between w-100">
                        <Button variant="secondary" onClick={() => {
                            setShow(false);
                        }}>
                            اغلاق
                        </Button>
                        <Button variant="success" onClick={() => confirm()}>
                            موافق
                            {isLoading&&<Spinner />}
                        </Button>
                    </div>
    
                </Modal.Footer>
            </Modal>
  )
}
