const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'hello from basic route' });
});

router.post('/login', (req, res) => {
    axios.get(
        `https://api.airtable.com/v0/app3X8S0GqsEzH9iW/Master?api_key=${process.env.AIRTABLE_KEY}`
    );
});

module.exports = router;
