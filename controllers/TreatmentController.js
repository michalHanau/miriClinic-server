const Controller = require('./Controller');
const TreatmentService = require('../services/TreatmentService');

class TreatmentController extends Controller {
    constructor() {
        super(TreatmentService)
    }

    async getTreatmentNames() {
        const data = await this.service.getTreatmentNames();
        const treatments = data.map(treatment => ({
            id: treatment.treatment_id,
            name: treatment.treatment_name
        }));
        return treatments;
    }


}

let treatmentController = new TreatmentController();
module.exports = treatmentController;