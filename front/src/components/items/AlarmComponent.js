import { ligthBlue, orange, red, yellow } from "../../Constants"

export default function AlarmComponent() {
    let alarms=[
        {value:red,text:' صنف منتهي الصلاحية ' },
        {value:yellow,text:'الكمية اقل من او تساوي الحد الحرج'},    
        {value:ligthBlue,text:'صنف تم التعديل عليه'}
    ]
    return (
        <div className="d-flex gap-5 my-4">
            {
                alarms?.map((el,i)=><div key={i} className="d-flex justify-content-center gap-2" >
                    <div>
                        <input style={{ border: 'none' }} type="color" value={el?.value} readOnly disabled />
                    </div>
                    <div>
                        <span style={{
                            fontWeight:'900'
                        }} > {el?.text} </span>
                    </div>
                </div>)
            }
            
        </div>
    )
}
