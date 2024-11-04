import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CustumNumberInput from "../../../Utilities/CustumNumberInput";
import { toast } from "react-toastify";
import removeTimeFromDate from "../../../Utilities/removeTimeFromDate";
import FormatDateForHTML from "../../../Utilities/FormatDateForHTML";

export default function AddQuantityModal({ show, setShow, category, setCategory, categories, setCategories, setSelectedOptionArr, type }) {
    const [newExpirationDate, setNewExpirationDate] = useState(() =>
        (category?.newExpirationDate && category?.expirationDatesArr?.length > 0) ? FormatDateForHTML(category?.newExpirationDate) : '');
    const [newQuantity, setNewQuantity] = useState(() =>
        (category?.totalQuantity && category?.expirationDatesArr?.length > 0) ? category?.totalQuantity : ''
    );
    const [price, setPrice] = useState(() =>
        (category?.unitPrice && category?.expirationDatesArr?.length > 0) ? category?.unitPrice : ''
    );

    const addQuantity = () => {
        if (type == 'payment') {
            if (newQuantity == '' || newQuantity == '0') {
                // console.log('kkkkkkkkkkk');
                return toast.error("من فضلك اكمل البيانات");
            }
        }
        else {
            if (newExpirationDate == '' || newQuantity == '' || newQuantity == '0' || price == '' || price == '0') {
                // console.log('kkkkkkkkkkk');
                return toast.error("من فضلك اكمل البيانات");
            }
        }



        // category.unitPrice= Number(price);
        // category.totalQuantity=Number(newQuantity);

        let date=''
        if(newExpirationDate=='') date=new Date();
        else date= newExpirationDate;

        let newCategory = {
            ...category,
            unitPrice: Number(price),
            totalQuantity: (Number(category?.totalQuantity) + Number(newQuantity)),
            newExpirationDate: removeTimeFromDate(date),
            expirationDatesArr: [
                ...category.expirationDatesArr,
                {
                    quantity: Number(newQuantity),
                    date: removeTimeFromDate(date)
                }
            ]
        };


        setCategory(newCategory);

        console.log("newCategory", newCategory);

        // let newCategories= categories?.map(el=> el?._id==newCategory?._id  ? newCategory : el);

        // console.log('newCategories',newCategories);

        // console.log('newCategory',newCategory);

        // setCategories(...newCategories);
        setSelectedOptionArr(prev => prev?.map(el => el?._id == newCategory?._id ? newCategory : el));

        setShow(false);
        // category.totalQuantity=Number(price * el?.totalQuantity)
    }


    // "_id": "6717a3f508c1baf43d1ce7d8",
    // "code": "iio",
    // "name": "aaa",
    // "criticalValue": 85,
    // "unitPrice": 20,
    // "totalQuantity": 200,
    // "unit": "20",
    // "expirationDatesArr": [
    //     {
    //         "_id": "6717a3f508c1baf43d1ce7d5",
    //         "date": "Thu Oct 03 2024 00:00:00 GMT+0200 (GMT+02:00)",
    //         "quantity": 20,
    //         "createdAt": "2024-10-22T13:09:09.159Z",
    //         "updatedAt": "2024-10-22T13:09:09.159Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "6717a3f508c1baf43d1ce7d4",
    //         "date": "Sat Oct 05 2024 00:00:00 GMT+0200 (GMT+02:00)",
    //         "quantity": 10,
    //         "createdAt": "2024-10-22T13:09:09.159Z",
    //         "updatedAt": "2024-10-22T13:09:09.159Z",
    //         "__v": 0
    //     }
    // ],
    // "createdAt": "2024-10-22T13:09:09.287Z",
    // "updatedAt": "2024-10-22T13:09:09.287Z",
    // "__v": 0,
    // "label": "aaa",
    // "value": "6717a3f508c1baf43d1ce7d8"


    return (
        <Modal show={show} onHide={() => {
            setCategory(null);
            setShow(false);
        }}>
            <Modal.Header>
                <Modal.Title style={{
                    whiteSpace: "wrap"
                }}>
                    {`الصنف : ${category?.name}`}
                    {/* {isEdit ? ' تعديل موظف' : 'اضافة موظف'} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {
                    type != 'payment' && <div className="form-group">
                        <label className="my-2"> تاريخ الصلاحية </label>
                        <input
                            value={newExpirationDate} onChange={(e) => setNewExpirationDate(e.target.value)}
                            required
                            type="date" className="form-control" placeholder=" تاريخ الصلاحية"
                        // onKeyPress={onKeyEnter}

                        />
                    </div>
                }

                <div className="form-group">
                    <label className="my-2"> الكمية </label>
                    <CustumNumberInput
                        value={newQuantity} setValue={setNewQuantity}
                        placeholder={'الكمية'}

                    />
                </div>

                {
                    type != 'payment' && <div className="form-group">
                        <label className="my-2"> السعر </label>
                        <CustumNumberInput
                            value={price} setValue={setPrice}
                            placeholder={'السعر'}

                        />
                    </div>
                }



                <div className="d-flex my-3 justify-content-between">

                    <Button onClick={() => addQuantity()} variant="primary" >
                        حفظ
                    </Button>

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
