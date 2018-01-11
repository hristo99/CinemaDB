function isLoggedIn(req) {
    return req.isAuthenticated();
}

function isCinemaAdmin(req) {
    return req.user && req.user.Role === 'cinemaAdmin';
}

function isMovieAdmin(req) {
    return req.user && req.user.Role === 'movieAdmin';
}

function isSystemAdmin(req) {
    return req.user && req.user.Role === 'systemAdmin';
}

function verify(...checks) {
    return (req, res, next) => {
        if (!isLoggedIn(req)) {
            res.status(401).send('Not authorized');
        }
        for (let check of checks) {
            if (check(req)) {
                return next();
            }
        }
        res.status(401).send('Not authorized');
    };
}

module.exports = {
    isCinemaAdmin,
    isMovieAdmin,
    isSystemAdmin,
    verify
};
