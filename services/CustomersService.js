const customersModel = require('../models/customersModel');

class CustomersService {

    async getAll(queryParameters) {
        let result = await customersModel.find({})
        if (result.length == 0) {
            throw new Error('Not found')
        }
        return result;
    }
}

let customersService = new CustomersService();
module.exports = customersService;