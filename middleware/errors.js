function errorResponse (err, req, res, next) {

    if(err.message.includes('duplicate'))
    {
        res.status(409).send(`User with email ${user.email} is already signed up`);
    } else if(
        err.message.includes('required') ||
        err.message.includes('noteId is invalid'))
    {
        res.status(400).send(err.message);
    } else if(
        err.message.includes('User not found') || 
        err.message.includes('Passwords do not match') || 
        err.message.includes('logged in') || 
        err.message.includes('Bad Token'))
    {
        res.status(401).send(err.message);
    } else if(err.message.includes('Unauthorized')) {
        res.status(404).send(err.message);
    } else {
        res.status(500).send(err.message);
    }
};

module.exports = errorResponse;