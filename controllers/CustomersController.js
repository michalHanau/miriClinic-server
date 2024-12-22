const Controller = require('./Controller');
const PariorityService = require('../services/CustomersService')

class CustomersController extends Controller {
    constructor() {
        super(PariorityService)
    }
}

let customersController = new CustomersController();
module.exports = customersController;