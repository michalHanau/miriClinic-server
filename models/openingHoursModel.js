const mongoose = require('mongoose');

const openingHoursSchema = mongoose.Schema({
    id: Number,
    day_of_week: String,
    open_time: Date,
    close_time: Date,
    is_active: String
}, { collection: 'OpeningHours' }
)


const model = mongoose.model('OpeningHours', openingHoursSchema);

module.exports = model;