import { ligthBlue, orange, red, yellow } from "../../Constants"

export default function AlarmComponent() {
    let alarms=[
        {value:yellow,text:'صنف به كميات منتهية الصلاحية'},
        {value:red,text:'صنف منتهي الصلاحية'},
        {value:orange,text:'الكمية تساوي الحد الحرج'},
        {value:ligthBlue,text:'تم التعديل عليه من قبل الموظف'}
    ]
    return (
        <div className="d-flex gap-5 my-4">
            {
                alarms?.map((el,i)=><div key={i} className="d-flex justify-content-center gap-2" >
                    <div>
                        <input style={{ border: 'none' }} type="color" value={el?.value} readOnly disabled />
                    </div>
                    <div>
                        <span > {el?.text} </span>
                    </div>
                </div>)
            }
            
        </div>
    )
}
