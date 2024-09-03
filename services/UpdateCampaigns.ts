// services/dailyTaskService.js
const cron = require('node-cron');
const axios = require('axios');

const dailyTask = () => {
    cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
        try {
            console.log('Running daily task at midnight');
            const response = await axios.get('https://api.example.com/data');
            // Process the response data as needed
            console.log('API call successful:', response.data);
        } catch (error) {
            console.error('Error during daily task:', error.message);
        }
    });
};

module.exports = dailyTask;
