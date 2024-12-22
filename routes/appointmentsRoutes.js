const express = require('express');
const router = express.Router();

const controller = require('../controllers/AppointmentController')

router.get('/', async (req, res, next) => {
    try {
        const result = await controller.getAll(req.query)
        res.json(result);
    }
    catch (error) {
        if (error.message.startsWith('Not found'))
            res.status(404).send(`Not found`);
        next(error);
    }
})

router.get('/available/:treatmentId', async (req, res, next) => {
    try {
        const result = await controller.getAvailableAppointment(req.params.treatmentId, req.query.date)
        res.json(result);
    }
    catch (error) {
        if (error.message.startsWith('Not found'))
            res.status(404).send(`Not found`);
        next(error);
    }
})

router.post('/', async (req, res, next) => {
    console.log("מגיע לROUTE")
    try {
        let result = await controller.insertNewAppointment(req.body);
        res.status(201).send(result);
    }
    catch (error) {
        if (error.message == 'invalid new volunteer id') {
            res.status(400).send(`invalid new volunteer id ${req.body._id} `)
        }
        else next(error);
    }

});


module.exports = router;