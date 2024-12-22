const OpeningHoursModel = require('../models/openingHoursModel');

class OpeningHoursService {

    async getAll(queryParameters) {
        let result = await OpeningHoursModel.find({})
        if (result.length == 0) {
            throw new Error('Not found')
        }
        return result;
    }

    // async getOpeningHours(){
    //     let result = await OpeningHoursModel.find({}, {_id: 0,id:1,day_of_week:1,open_time:1,close_time:1,})
    //     if (result.length == 0) {
    //         throw new Error('Not found')
    //     }
    //     return result;
    // }

    async getOpeningHours(dayOfWeek){
        let result = await OpeningHoursModel.findOne({ id: dayOfWeek }, { _id: 0, id: 1, day_of_week: 1, open_time: 1, close_time: 1 });
        if (!result) {
            throw new Error('Not found')
        }
        return result;
    }
}

let customersService = new OpeningHoursService();
module.exports = customersService;