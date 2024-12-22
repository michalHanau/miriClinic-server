const express = require('express');
const router = express.Router();

const Controller = require('../controllers/AuthController');


router.get('/', async (req, res) => {
    try {
        const url = await Controller.authenticate();
        res.redirect(url); 
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokens = await Controller.oauth2callback(code);
        console.log('Tokens acquired:', tokens);
        res.send('Authentication successful! You can close this tab.');
    } catch (error) {
        console.error('Error handling OAuth2 callback:', error);
        res.status(500).send('Authentication failed. Please try again.');
    }
});

module.exports = router;
