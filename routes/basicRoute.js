const express = require('express');

router.get('/', (req, res) => {
    res.status(200).json({message: 'hello from basic route'})
})

module.exports = router;