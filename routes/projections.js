const express = require('express');
const router = express.Router({ mergeParams: true });
const { verify, isCinemaAdmin, isSystemAdmin } = require('../modules/security');

router.post('/', verify(isCinemaAdmin, isSystemAdmin), (req, res) => {
    res.end();
});

module.exports = router;