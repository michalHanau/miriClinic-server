const mongoose = require('mongoose');

const appointmentsSchema = mongoose.Schema({
    customer_id: Number,
    treatment_id: Number,
    date: Date,
    start: Date,
    end: Date,
    notes: String
}, { collection: 'Appointments' }
)


const model = mongoose.model('Appointments', appointmentsSchema);

module.exports = model;