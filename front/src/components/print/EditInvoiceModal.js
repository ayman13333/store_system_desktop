import { useContext, useState } from "react";
import { MyContext } from "../..";
import { Button, Modal, Spinner } from "react-bootstrap";
import CustumNumberInput from "../../Utilities/CustumNumberInput";
import FormatDateForHTML from "../../Utilities/FormatDateForHTML";
import { toast } from "react-toastify";
import ConfirmEditModal from "../items/ConfirmEditModal";

function EditInvoiceModal({ show, setShow, foundInvoice, setFoundInvoice }) {
    const { entities, setEntities } = useContext(MyContext);
    // رقم  الفاتورة
    const [invoiceNumber, setInvoiceNumber] = useState(() => foundInvoice?.serialNumber);
    // تاريخ التوريد
    const [supplyDate, setSupplyDate] = useState(() => new Date(foundInvoice?.supplyDate));
    // اسم جهة التوريد
    const [selectedSupplier, setSelectedSupplier] = useState(() => foundInvoice?.supplierID?._id);

    const [isLoading, setIsLoading] = useState(() => false);

    const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);




    console.log('entities', entities);
    console.log('foundInvoice', foundInvoice);

    const EditInvoiceFunc = async () => {
        try {

            const data = {
                invoiceCode: foundInvoice?.invoiceCode,
                supplierID: selectedSupplier,
                supplyDate: new Date(supplyDate)?.toString(),
                invoiceNumber
            }

            console.log('data', data);
            //  return;
            setIsLoading(true);
            const result = await window?.electron?.editInvoice(data);
            setIsLoading(false);

            // after logic
            if (result?.success == true) {
                setShow(false);
                setFoundInvoice(null);
                toast.success('تم التعديل بنجاح');
            }
            else {
                toast.error('فشل في عملية التعديل');
            }

        } catch (error) {
            console.log('error', error?.message);
            setIsLoading(false);
            return toast.error('فشل في عملية التعديل');
        }
    }

    return (
        <Modal show={show} onHide={() => {
            setShow(false);
        }}>
            <Modal.Header >
                <Modal.Title>
                    <h1> تعديل الفاتورة  </h1>

                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div className="form-group">
                    <label className="my-2"> اسم الجهة  </label>

                    <select
                        value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="form-control"
                    >
                        {
                            entities?.length > 0 && entities?.map((el, i) => <option key={i} value={el?._id}>{el?.fullName}</option>)
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label className="my-2"> رقم  الفاتورة </label>
                    <CustumNumberInput
                        value={invoiceNumber} setValue={setInvoiceNumber}
                        placeholder={'رقم  الفاتورة'}
                        required={true}
                    />
                </div>

                <div className="form-group">
                    <label className="my-2">  تاريخ الفاتورة </label>
                    <input
                        value={FormatDateForHTML(supplyDate)}
                        onChange={(e) => setSupplyDate(new Date(e.target.value))}
                        required
                        type={'date'}
                        className="form-control"
                    />
                </div>



                {
                    showConfirmEditModal && <ConfirmEditModal
                        show={showConfirmEditModal} setShow={setShowConfirmEditModal}
                        func={EditInvoiceFunc}
                    />
                }
            </Modal.Body>

            <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                    }}>
                        اغلاق
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowConfirmEditModal(true);
                            // editCategory()
                        }}
                        disabled={isLoading}
                    >
                        موافق {isLoading && <Spinner />}
                    </Button>
                </div>

            </Modal.Footer>
        </Modal>
    )
}

export default EditInvoiceModal;