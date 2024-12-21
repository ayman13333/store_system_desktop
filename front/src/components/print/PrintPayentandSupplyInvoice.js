import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
 import './invoice.css'; // Import the CSS file
 import logo from "../../images/logo.jpg";
import { useLocation, useNavigate } from 'react-router-dom';
import FormatDate from '../../Utilities/FormatDate';

export default function PrintPayentandSupplyInvoice() {
    const location = useLocation();

    console.log('location',location?.state);
    const navigate = useNavigate();

    const handleDownload = async () => {

        const element = document.getElementById('invoice');
        //const buttons = document.querySelectorAll('.invoice-actions');

        // Temporarily hide the buttons
       // buttons.forEach(button => button.style.display = 'none');

        // Capture the element as a canvas
        const canvas = await html2canvas(element, { scale: 1 }); // Increase scale for better quality
        const imgData = canvas.toDataURL(logo);

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm', // Use mm for precise dimension
            format: 'a4'
        });

        const pdfWidth = 210;  // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        const imgWidth = canvas.width * 0.264583;  // Convert px to mm
        const imgHeight = canvas.height * 0.264583;

        // const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
        // const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
        // const imgWidth = canvas.width * 0.75; // Convert px to mm (1 px = 0.75 mm)
        // const imgHeight = canvas.height * 0.75; // Convert px to mm

        // Calculate the scaling factor to fit image in PDF page
        const widthRatio = pdfWidth / imgWidth;
        const heightRatio = pdfHeight / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio); // Scale to fit within the page

        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;

        // Center the image on the page
        const xOffset = (pdfWidth - imgScaledWidth) / 2;
        const yOffset = (pdfHeight - imgScaledHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);

        //   doc.save(`فاتورة-رقم-${result?.serialNumber}-حجز جديد.pdf`);

        // Save PDF
        pdf.save(`فاتورة-رقم-${location?.state?.serialNumber}-فاتورة-استكمال.pdf`);

        //  navigate(-1);

        // Show the buttons again
      //  buttons.forEach(button => button.style.display = 'flex'); // Use 'flex' to match default layout or use any display property as required
    };
  return (
    <div className="app-container">
    <section id="invoice" className="invoice-section">
        <div className="invoice-container">
            <div className="invoice-header">
                <div>
                    {/* <h2 className="invoice-title">  رقم امر الدفع : {location?.state?.serialNumber} </h2> */}
                    <h2 className="invoice-title">  نوع الفاتورة : {'فاتورة استكمال'} {location?.state?.isTransferred && (' (نقل حجز) ')} </h2>
                </div>
                <img src={logo} alt="Logo" className="invoice-logo" />
            </div>



            <div className="invoice-body">

                <div className="invoice-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th colSpan={2} className='text-center'> <h4>  بيانات الفاتورة </h4> </th>
                                {/* <th className='text-center'> المبلغ </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='text-center' >   كود الفاتورة </td>
                                <td className='text-center' > {location?.state?.userID?.fullName} </td>
                            </tr>
                            <tr>
                                <td className='text-center' >  رقم الفاتورة </td>
                                <td className='text-center' >
                                    {location?.state?.userID?.cardNumber}
                                </td>
                            </tr>
                            {/* <tr>
                                <td className='text-center' > رقم التليفون </td>
                                <td className='text-center' > {location?.state?.userID?.mobile} </td>
                            </tr> */}
                            {/* <tr>
                                <td className='text-center'>  تصنيف العميل </td>
                                <td className='text-center'>{type} </td>
                            </tr> */}

                            {/* {location?.state?.bookDate.toISOString().split('T')[0]} */}
                            <tr>
                                <td className='text-center'>  تاريخ الفاتورة </td>
                                <td className='text-center'> {FormatDate(new Date(location?.state?.bookDate))} </td>
                            </tr>

                            <tr>
                                <td className='text-center'>  تاريخ  التسجيل </td>
                                <td className='text-center'>{FormatDate(new Date(location?.state?.arrivalDate))} </td>
                            </tr>
                            
                            <tr>
                                <td className='text-center' >  جهة الصرف </td>
                                <td className='text-center' >
                                    {location?.state?.userID?.cardNumber}
                                </td>
                            </tr>

                          


                        </tbody>
                    </table>
                </div>


                <div className="invoice-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th colSpan={2} className='text-center'> <h4>  بيانات الاصناف </h4> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <td className='text-center' > حالة الحجز </td>
                                <td className='text-center' > {location?.state?.status} </td>
                            </tr> */}
                          <tr>
                                <th className="text-center" scope="col"> الاسم </th>
                             
                                
                                <th className="text-center" scope="col"> سعر </th>
                                <th className="text-center" scope="col"> كمية </th>
                                {/* <th className="text-center" scope="col"> وحدة </th>
                                <th className="text-center" scope="col"> الاجمالي </th> */}
                            </tr>
                        </tbody>
                    </table>
                </div>

          

                <div className="invoice-actions">
                    <button type="button" className="btn btn-primary" onClick={handleDownload}> تنزيل </button>
                    <button onClick={() => navigate(-1)} className="btn btn-danger"> رجوع </button>
                </div>
            </div>
        </div>
    </section>
</div>
  )
}
