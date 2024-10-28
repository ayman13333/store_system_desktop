
export default function FormatDate(date) {
    // let date = new Date();

    // Extract day, month, and year
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based, so we add 1
    let year = date.getFullYear();
    
    // Pad single-digit days and months with leading zeros
    // day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
    
    // Format the date as DD/MM/YYYY 
    let formattedDate = `${year}-${month}-${day}`;
    // console.log("Formatted date:", formattedDate);
    return formattedDate;
}
// 

