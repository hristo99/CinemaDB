const express = require('express');
const router = express.Router({ mergeParams: true });
const { verify, isCinemaAdmin, isSystemAdmin } = require('../modules/security');

router.post('/', (req, res) => {
    console.log(req.params.cinemaId);
    res.end();
});



module.exports = router;