const express = require('express');
const router = express.Router();
const controller = require('../controllers/LoginController')

router.post('/register', async (req, res, next) => {
    try {
        const result = await controller.registerUser(req.body);
        res.status(201).json(result); 
    } catch (error) {
        if (error.message === 'המשתמש קיים במערכת') {
            return res.status(409).send('User already exists');
        }
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    console.log("router")
    try {
        const result = await controller.loginUser(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(401).send('Invalid email');
        }
        next(error);
    }
});


module.exports = router;

