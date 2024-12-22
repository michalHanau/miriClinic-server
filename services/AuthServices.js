require('dotenv').config();
const { google } = require('googleapis');
const customersModel = require('../models/customersModel');
const roles = require('../enum/rolesEnum');

const oAuth2Client = new google.auth.OAuth2(
    process.env.Client_ID, // Client ID
    process.env.Client_Secret, // Client Secret
    'http://localhost:3000/api/auth/oauth2callback' // Redirect URI
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

class AuthService {

    // פונקציה ליצירת URL לאישור
    async generateAuthUrl() {
        return oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            //מבקש לקבל את התוקן-(refresh_token) 
            //שעל ידו ניתן לחדש את התוקן אוטומטי בכל פעם שמבקשים גישה
            prompt: 'consent' 
        });
    };

    // פונקציה שמטפלת בקוד ההחזרה מ-Google
    async handleOAuth2Callback(code) {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('Tokens received:', tokens);
        oAuth2Client.setCredentials(tokens);

        // שמירת ה-Refresh Token וה-Access Token במסד הנתונים
        await customersModel.updateOne(
            { customer_id: 14 },
            {
                googleAuth: {
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expiry_date: tokens.expiry_date,
                }
            }
        );

        return tokens;

    };

    // פונקציה לשליפת הטוקנים ולבדיקת תוקפם
    async getManagerTokens() {
        const manager = await customersModel.findOne({ customer_id: 14, role: roles.DEVELOPER });

        if (!manager) {
            throw new Error('Customer not found');
        }
        const tokens = manager.googleAuth;
        console.log("tokens",tokens)

        //לבדוק למה נכנס לIF
        // console.log(tokens)
        // if (!tokens || !tokens.expiry_date) {
        //     throw new Error('No valid tokens found');
        // }
        // בדוק אם הטוקן קיים ויש לו תאריך תפוגה תקין
        console.log('Expiry Date:', tokens.expiry_date);

        if (!tokens) {
            throw new Error('No valid tokens found or token expired');
        }
        // בדיקת אם הטוקן בתוקף
        if (tokens.expiry_date <= Date.now()) {
            // רענון הטוקן
            const newTokens = await this.refreshAccessToken(tokens);
            // כאן תעדכני את המסד הנתונים עם הטוקנים החדשים
            console.log("חזרנו לפה?")
            manager.tokens = newTokens;
            await manager.save();
            return { newTokens, oAuth2Client };
        }
        return { tokens, oAuth2Client }
    }

    // פונקציה לרענון הטוקן
    async refreshAccessToken(tokens) {
        oAuth2Client.setCredentials(tokens); // הגדרת הטוקנים
        console.log("רענון הטוקן",oAuth2Client)
        const newTokens = await oAuth2Client.refreshAccessToken(); // רענון הטוקן
        return newTokens.credentials; // מחזירה את הטוקנים החדשים
    }
}

let authService = new AuthService();
module.exports = authService;