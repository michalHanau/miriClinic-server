
const timezone = 'Asia/Jerusalem'; // אזור הזמן המוגדר

const today = new Date();
const options = { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const localDateTime = today.toLocaleString('en-US', options);
console.log("Local date and time:", localDateTime);
const today2 = new Date(localDateTime);
console.log("Local date2:", today2);



export { localDateTime , timezone }; // ייצוא של אזור הזמן אם תרצה להשתמש בו במקומות אחרים
