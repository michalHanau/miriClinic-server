const appointmentModel = require('../models/appointmentsModel');
const treatmentsModel = require('../models/treatmentsModel');
const customersModel = require('../models/customersModel');
require('dotenv').config();
const { DateTime } = require('luxon');
const { google } = require('googleapis');



//const {  localDateTime , timezone } = require('../utils/timezone');

class AppointmentService {

    async getAll(queryParameters) {
        let result = await appointmentModel.find({})
        if (result.length == 0) {
            throw new Error('Not found')
        }
        return result;
    }

    async getAvailableAppointment(treatmentDuration, openingHours, selectedDate) {
        //משתנה חדש ובו יהיו התורים
        const availableSlots = [];


        const date = new Date(selectedDate)
        //שליפת התורים התפוסים
        const bookedAppointments = await this.getAppointmentsByDay(date);

        const { open_time, close_time } = openingHours;

        //יצירת משתנה שיבדוק לפי שעה האם פנוי/תפוס
        let currentTime = new Date(open_time);
        const closeTime = new Date(close_time);

        //לולאה העוברת על טווח הזמן שבשעות הפתיחה
        while (currentTime < closeTime) {

            //יצירת משתנה שידמה את זמן סיום התור
            const slotEnd = new Date(currentTime.getTime() + treatmentDuration * 60000)
            //אם התור יגמר לפני סגירת הקליניקה
            if (slotEnd <= closeTime) {
                //בודק אם לפחות אחד התורים הקבועים כבר מתנגש עם התור החדש - אם כן - המשתנה מוגדר כ"לא"ל
                const isAvailable = !bookedAppointments.some(appointment => {
                    return (currentTime < appointment.end && slotEnd > appointment.start);
                });
                //אם זמני התור החדש לא חופפים עם זמני תור קיים - הוספת התור החדש לרשימת התורים הפוניים
                if (isAvailable) {
                    availableSlots.push({
                        date: new Date(date),
                        start: new Date(currentTime),
                        end: new Date(slotEnd)
                    });
                    //העברת הזמן הנוכחי לזמן הסיום של התור החדש
                    currentTime = slotEnd;
                }
                //אם זמני התור החדש מתנגשים בזמני תור קיים
                //העברת הזמן הנוכחי לסוף זמן התור הקיים
                else {
                    const nextAppointment = bookedAppointments.find(appointment =>
                        currentTime < appointment.end && slotEnd > appointment.start
                    );
                    currentTime = nextAppointment ? new Date(nextAppointment.end) : closeTime;
                }
            }
            else {
                break;
            }
        }
        return availableSlots;
    }

    async getAppointmentsByDay(date) {
        try {
            const appointmentsByDay = await appointmentModel.find({ date: date }, { _id: 0, date: 1, start: 1, end: 1 });
            return appointmentsByDay;
        } catch (err) {
            console.error('Error fetching appointments:', err);
            throw err;
        }
    }

    //ללא שינוי של שליפה לפי יום
    // async getAvailableAppointment(treatmentDuration, openingHours) {
    //     //משתנה חדש ובו יהיו התורים
    //     const availableSlotsByDay = {};
    //     //שליפת התורים התפוסים
    //     const bookedAppointmentsByDay = await this.getAppointmentsByDay();
    //     //יצירת משתני תאריכים של היום ועוד שבוע
    //     //const today = toZonedTime(new Date(),timeZone);
    //     const today = DateTime.now().setZone(timeZone);
    //     const todayDate = today.toJSDate()
    //     let add;
    //     if(today.toJSDate())
    //         add=3; 
    //     else
    //         add=2;       
    //     todayDate.setHours(todayDate.getHours() + add);        
    //     const oneWeekLater = new Date(todayDate);
    //     oneWeekLater.setDate(todayDate.getDate() + 6);

    //     //לולאה שעוברת על כל הימים - מהיום ועד עוד שבוע
    //     for (let currentDate = new Date(todayDate); currentDate <= oneWeekLater; currentDate.setDate(currentDate.getDate() + 1)) {
    //         //קבלת היום בפורמט מספרי לפי התאריך
    //         const dayIndex = new Date(currentDate).getDay();
    //         //אם שבת - תמשיך הלאה
    //         if (dayIndex == 6) {
    //             continue;
    //         }
    //         //חיפוש במערך שעות הפתיחה לפי ימים - את שעות הפתיחה של היום הנוכחי
    //         const hours = openingHours.find(openingHour => openingHour.id == dayIndex + 1)
    //         const { day_of_week, open_time, close_time } = hours;
    //         // קבלת התאריך הנוכחי בפורמט YYYY-MM-DD
    //         //לשנות שלא נצטרך++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //         const currentDateStr = currentDate.toISOString().split('T')[0];
    //         // קבלת התורים התפוסים ליום הנוכחי ואם אין תורים תפוסים - מערך ריק  
    //         const bookedSlots = bookedAppointmentsByDay[currentDateStr] || []
    //         //יצירת משתנה שיבדוק לפי שעה האם פנוי/תפוס
    //         let currentTime = new Date(open_time);
    //         const closeTime = new Date(close_time);
    //         //לולאה העוברת על טווח הזמן שבשעות הפתיחה
    //         while (currentTime < closeTime) {

    //             //יצירת משתנה שידמה את זמן סיום התור
    //             const slotEnd = new Date(currentTime.getTime() + treatmentDuration * 60000)
    //             //אם התור יגמר לפני סגירת הקליניקה
    //             if (slotEnd <= closeTime) {
    //                 //בודק אם לפחות אחד התורים הקבועים כבר מתנגש עם התור החדש - אם כן - המשתנה מוגדר כ"לא"ל
    //                 const isAvailable = !bookedSlots.some(appointment => {
    //                     return (currentTime < appointment.end && slotEnd > appointment.start);
    //                 });
    //                 //אם זמני התור החדש לא חופפים עם זמני תור קיים - הוספת התור החדש לרשימת התורים הפוניים
    //                 if (isAvailable) {
    //                     if (!availableSlotsByDay[day_of_week]) {
    //                         availableSlotsByDay[day_of_week] = [];
    //                     }
    //                     availableSlotsByDay[day_of_week].push({
    //                         date: new Date(currentDate),
    //                         start: new Date(currentTime),
    //                         end: new Date(slotEnd)
    //                     });
    //                     //העברת הזמן הנוכחי לזמן הסיום של התור החדש
    //                     currentTime = slotEnd;
    //                 }
    //                 //אם זמני התור החדש מתנגשים בזמני תור קיים
    //                 //העברת הזמן הנוכחי לסוף זמן התור הקיים
    //                 else {
    //                     const nextAppointment = bookedSlots.find(appointment =>
    //                         currentTime < appointment.end && slotEnd > appointment.start
    //                     );
    //                     currentTime = nextAppointment ? new Date(nextAppointment.end) : closeTime;
    //                 }
    //             }
    //             else{
    //                 break;
    //             }
    //         }
    //     };
    //     return availableSlotsByDay;
    // }

    // async getAppointmentsByDay() {
    //     try {

    //         const today = new Date();
    //         const oneWeekLater = new Date();
    //         oneWeekLater.setDate(today.getDate() + 7);


    //         // שליפת התורים מהמודל
    //         const appointments = await appointmentModel.find({
    //             date: { $gte: today, $lte: oneWeekLater }
    //         });

    //         // מיון התורים לפי יום והפיכת התוצאה למינימלית לשדות start ו-end
    //         const appointmentsByDay = appointments.reduce((acc, appointment) => {
    //             const { date, start, end } = appointment;
    //             const dateString = new Date(date).toISOString().split('T')[0];

    //             if (!acc[dateString]) {
    //                 acc[dateString] = [];
    //             }
    //             acc[dateString].push({ date, start, end });
    //             return acc;
    //         }, {});

    //         console.log(appointmentsByDay)
    //         return appointmentsByDay;
    //     } catch (err) {
    //         console.error('Error fetching appointments:', err);
    //         throw err;
    //     }
    // }

    async insertNewAppointments(newAppointments, tokens, oAuth2Client) {
        let appointments = new appointmentModel(newAppointments)
        await appointments.save()

        // שלב 1: שמור את התאריך מהשדה date
        const appointmentDate = new Date(newAppointments.date); // התאריך הנכון
        // שלב 2: פרק את השעות מהשדות start ו-end
        const startTime = new Date(newAppointments.start);
        const endTime = new Date(newAppointments.end);

        // שלב 3: עדכן את השעות בתאריך הנכון
        startTime.setFullYear(appointmentDate.getFullYear());
        startTime.setMonth(appointmentDate.getMonth());
        startTime.setDate(appointmentDate.getDate());

        endTime.setFullYear(appointmentDate.getFullYear());
        endTime.setMonth(appointmentDate.getMonth());
        endTime.setDate(appointmentDate.getDate());

        //למציאת שם הטיפול לפי הID שנתון לי מפירוט התור
        //לבדוק האם ניתן להשתמש בפונקציה שקיימת כבר בסרוויס של  טיפולים
        const treatment = await treatmentsModel.findOne({ treatment_id: newAppointments.treatment_id });
        if (!treatment) {
            throw new Error('Treatment not found');
        }

        //למציאת שם הלקוחה
        const customer = await customersModel.findOne({ customer_id: newAppointments.customer_id });
        if (!customer) {
            throw new Error('customer not found');
        }
        console.log("treatment.calendar_color",treatment.calendar_color)
        // יצירת אובייקט האירוע
        const eventDetails = {
            title: treatment.treatment_name + "-" + customer.first_name + " " + customer.last_name,
            description: newAppointments.notes,
            startDateTime: startTime.toISOString(), // המרת לישום המומלץ של תאריך ושעה
            endDateTime: endTime.toISOString(), // המרת לישום המומלץ של תאריך ושעה
            colorId: treatment.calendar_color,
        };
        await this.addEventToManagerCalendar(eventDetails, tokens, oAuth2Client);
        return newAppointments;
    }

    async addEventToManagerCalendar(eventDetails, tokens, oAuth2Client) {
       // console.log("tokens:", tokens);

        oAuth2Client.setCredentials(tokens); // הגדרת ה-Tokens
        //console.log("OAuth2Client credentials:", oAuth2Client.credentials);

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        //console.log(calendar.events)
        const event = {
            summary: eventDetails.title,
            description: eventDetails.description,
            start: {
                dateTime: eventDetails.startDateTime,
                timeZone: 'Asia/Jerusalem',
            },
            end: {
                dateTime: eventDetails.endDateTime,
                timeZone: 'Asia/Jerusalem',
            },
            colorId: eventDetails.colorId,
        };
        //console.log("event", event)


        // const calendarList = await calendar.calendarList.list();

        // calendarList.data.items.forEach((calendar) => {
        //   console.log(`Calendar ID: ${calendar.id}, Summary: ${calendar.summary}`);
        // });

        try {
            const response = await calendar.events.insert({
                auth: oAuth2Client,
                calendarId: 'primary', // יומן ראשי
                resource: event,
            });
            console.log('Event created: %s', response.data.htmlLink);
        } catch (error) {
            console.error('Error creating event: ', error);
        }
    }




}

let appointmentService = new AppointmentService();
module.exports = appointmentService;