const Controller = require('./Controller');
const PariorityService = require('../services/AppointmentService')
const TreatmentService = require('../services/TreatmentService');
const OpeningHoursService = require('../services/OpeningHoursService')
const AuthServices = require('../services/AuthServices')

class AppointmentController extends Controller {
    constructor() {
        super(PariorityService)
        this.treatmentService =  TreatmentService;
        this.openingHoursService = OpeningHoursService
        this.authServices = AuthServices
    }

    async getAvailableDates(treatmentId){
        const date = await this.service.getAvailableDates(treatmentId);
        return date;
    }

    async getAvailableAppointment(treatmentId, date) {
        const treatmentDuration = await this.treatmentService.getTreatmentDuration(treatmentId);
        const dayOfWeek = new Date(date).getDay()
        const openingHours = await this.openingHoursService.getOpeningHours(dayOfWeek+1);
        const availableSlots = await this.service.getAvailableAppointment(treatmentDuration, openingHours,date);
        return availableSlots;
    }

    async insertNewAppointment(newAppointment) {
        console.log("מגיע לקונטרולר")
        const { tokens, oAuth2Client } = await this.authServices.getManagerTokens();
        console.log(oAuth2Client,"oAuth2Client")
        const insertedObj = await this.service.insertNewAppointments(newAppointment,tokens,oAuth2Client);

        return insertedObj;
    }
}

let appointmentController = new AppointmentController();
module.exports = appointmentController;