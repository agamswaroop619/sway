
export function getDate()  {

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

      // Check if the current item's id matches the id from the action payload
      const time = new Date();
      const month = months[time.getMonth() - 1];
      const year = time.getFullYear();
      const day = time.getDate();
      const date = `${month} ${day}, ${year}`;

      return date;
}