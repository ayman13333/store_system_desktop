import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import CustumNumberInput from '../../Utilities/CustumNumberInput';
import { toast } from "react-toastify";
import removeTimeFromDate from '../../Utilities/removeTimeFromDate';
import FormatDateForHTML from '../../Utilities/FormatDateForHTML';


export default function ExpirationDateModal({ show, setShow ,expirationDatesArr,setExpirationDatesArr,rowToEdit,setRowToEdit }) {

    const options = { month: 'long', day: 'numeric', year: 'numeric' };

    const[newExpirationDate,setNewExpirationDate]=useState(()=>{
        if(rowToEdit){
           // const date = new Date('2024-10-22');
            
            return FormatDateForHTML(rowToEdit?.date) ;
           // return rowToEdit?.date?.toLocaleDateString(); 
           // rowToEdit?.date?.toLocaleDateString('en-US', options);

        }
        else{
            return '';
        }
     // return  rowToEdit ? rowToEdit?.date?.toLocaleDateString('en-US', options) :''
    });
    const [newQuantity, setNewQuantity] = useState(()=>{
        return rowToEdit ? rowToEdit?.quantity :'';
    });

    const addRow=()=>{
       // console.log('kkkkkkkkkkk');
        if(newExpirationDate=='' || newQuantity=='' || newQuantity=='0'){
           // console.log('kkkkkkkkkkk');
            return toast.error("من فضلك اكمل البيانات");
        }

        let key;
        if(expirationDatesArr.length==0) key=expirationDatesArr.length;
        else{
            key=expirationDatesArr[expirationDatesArr.length-1].key +1;

        }

        let obj={
            key,
            date:removeTimeFromDate(newExpirationDate),
            quantity:newQuantity
        }

        setExpirationDatesArr(prev=>[...prev,obj]);

        setNewExpirationDate('');
        setNewQuantity('');
        setShow(false);

    }

    const editRow=()=>{

        if(newExpirationDate=='' || newQuantity=='' || newQuantity=='0'){
            // console.log('kkkkkkkkkkk');
             return toast.error("من فضلك اكمل البيانات");
         }
         
        let newexpirationDatesArr=expirationDatesArr?.map(el=>{
            if(el?.key==rowToEdit?.key){
                return {
                    key:rowToEdit?.key,
                    date:removeTimeFromDate(newExpirationDate),
                    quantity:newQuantity
                }
            }
            else return el;
        });

        setExpirationDatesArr(newexpirationDatesArr);
        setNewExpirationDate('');
        setNewQuantity('');
        setShow(false);
    }

   // console.log('rowToEdit',rowToEdit?.date?.toISOString());
    console.log('newExpirationDate',newExpirationDate);

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>
                    {/* {isEdit ? ' تعديل موظف' : 'اضافة موظف'} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className="form-group">
                    <label className="my-2"> تاريخ الصلاحية </label>
                    <input
                         value={newExpirationDate} onChange={(e) => setNewExpirationDate(e.target.value)}
                        required
                        type="date" className="form-control" placeholder=" تاريخ الصلاحية"
                    // onKeyPress={onKeyEnter}

                    />
                </div>

                <div className="form-group">
                    <label className="my-2"> الكمية </label>
                    <CustumNumberInput
                    value={newQuantity} setValue={setNewQuantity}
                    placeholder={'الكمية'}
                    required={true}
                />
                </div>




                <div className="d-flex my-3 justify-content-between">

                    <Button onClick={()=>{
                       if(rowToEdit==null) addRow();
                       else editRow();
                        }} variant="primary" >
                        حفظ
                    </Button>

                    <Button className="gap-2" variant="secondary" onClick={() => {
                        setShow(false);

                    }}>
                        اغلاق
                    </Button>
                </div>
            </Modal.Body>

        </Modal>
    )
}
