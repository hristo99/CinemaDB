module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    isCinemaAdmin(req, res, next) {
        if (req.user && req.user.Role == 'cinemaAdmin') {
            return next();
        }
        res.status(401).send('Not authorized');
    },
    isMovieAdmin(req, res, next) {
        if (req.user && req.user.Role == 'movieAdmin') {
            return next();
        }
        res.status(401).send('Not authorized');
    },
    isSystemAdmin(req, res, next) {
        if (req.user && req.user.Role == 'systemAdmin') {
            return next();
        }
        res.status(401).send('Not authorized');
    }
}
