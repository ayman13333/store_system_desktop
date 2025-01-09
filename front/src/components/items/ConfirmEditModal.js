import { Button, Modal } from "react-bootstrap";

export default function ConfirmEditModal({ show, setShow, func , type }) {

    const confirm = async () => {
         await func();
         setShow(false);
    }
    return (
        <Modal show={show} onHide={() => {
            setShow(false);
        }}>
            <Modal.Header >
                <Modal.Title>
                    {
                        type=="delete" ?
                        "هل انت متأكد من الحذف ؟"
                        :
                        "هل انت متأكد من التعديل ؟"
                    }
                    
                </Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                    }}>
                        اغلاق
                    </Button>
                    <Button variant="danger" onClick={() => confirm()}>
                        موافق
                    </Button>
                </div>

            </Modal.Footer>
        </Modal>
    )
}
