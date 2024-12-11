
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getDate()  {

  

      // Check if the current item's id matches the id from the action payload
      const time = new Date();
      const month = months[time.getMonth() - 1];
      const year = time.getFullYear();
      const day = time.getDate();
      const date = `${month} ${day}, ${year}`;

      return date;
}

export function nextDate() {

  function getNextDay() {
    const date= new Date()
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 7); // Increment the date by 1
    return nextDay;
  }
  
 const date = getNextDay();
 const month = months[date.getMonth()-1];
 const day = date.getDate();
 const year= date.getFullYear();

 return `${day} ${month}, ${year}`;

}