module.exports = {};

module.exports.checkUser = async (req, res, next) => {
    const user = req.body;

    try {
        if(!user || JSON.stringify(user) === '{}') {
            throw new Error('User is required');
        } else if(!user.email || user.email.length === 0 ) {
            throw new Error("Email is required");
        } else if(!user.password || user.password.length === 0) {
            throw new Error("Password is required");
        } else {
            next();
        }
    } catch(e) {
        next(e);
    }
}