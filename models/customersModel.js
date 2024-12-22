const mongoose = require('mongoose');
const roles = require('../enum/rolesEnum');

const customersSchema = mongoose.Schema({
    customer_id: Number,
    first_name: String,
    last_name: String,
    phone: String,
    email: String,
    birthdate: Date,
    role: {
        type: String,
        enum: roles,
    },
    password: String,
    googleAuth: {
        access_token: String,
        refresh_token: String,
        expiry_date: Number
    }
}, { collection: 'Customers' }
)

const model = mongoose.model('Customers', customersSchema);

module.exports = model;