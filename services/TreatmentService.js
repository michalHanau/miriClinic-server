const treatmentModel = require('../models/treatmentsModel');

class TreatmentService {

    async getAll(queryParameters) {
        let result = await treatmentModel.find({})
        if (result.length == 0) {
            throw new Error('Not found')
        }
        return result;
    }

    async getTreatmentNames(){
        let result = await treatmentModel.find({}, {_id: 0,treatment_id:1,treatment_name:1})
        if (result.length == 0) {
            throw new Error('Not found')
        }
        return result;
    }

    async getTreatmentDuration(treatmentId) {
        const id= Number(treatmentId)
        const treatment = await treatmentModel.findOne({ treatment_id: id }, { _id: 0, treatment_duration: 1 });
        if (!treatment) {
            throw new Error('Treatment not found');
        }
        return treatment.treatment_duration;
    }

}

let treatmentService = new TreatmentService();
module.exports = treatmentService;