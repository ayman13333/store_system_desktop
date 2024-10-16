export default function removeTimeFromDate(date) {
    // Create a copy of the date to avoid mutating the original object
    const newDate = new Date(date);
  
    // Set hours, minutes, seconds, and milliseconds to 0
    newDate.setHours(0, 0, 0, 0);
  
    return newDate;
  }