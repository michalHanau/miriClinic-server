const Controller = require('./Controller');
const PariorityService = require('../services/AuthServices')

class CustomersController extends Controller {
    constructor() {
        super(PariorityService)
    }

    // פונקציה שמטפלת באישור המשתמש
    async authenticate() {
        const url = await this.service.generateAuthUrl();
        return url;
    };

    // פונקציה שמטפלת בקוד ההחזרה מ-Google
    async oauth2callback(code) {
        const tokens = await this.service.handleOAuth2Callback(code);
        return tokens;
    };

}

let customersController = new CustomersController();
module.exports = customersController;