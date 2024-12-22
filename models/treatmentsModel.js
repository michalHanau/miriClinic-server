const mongoose = require('mongoose');

const treatmentsSchema = mongoose.Schema({
    treatment_id: Number,
    treatment_name: String,
    price: Number,
    treatment_duration: Number,
    diary:{
    starting_from: String, 
    days: Number
    },
    calendar_color: String
}, { collection: 'Treatments' }
)

const model = mongoose.model('Treatments', treatmentsSchema);

module.exports = model;