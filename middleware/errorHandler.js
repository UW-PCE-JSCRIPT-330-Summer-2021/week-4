function errorHandler (error, req, res, next) {
    if (error.message.includes("The note was not found")) {
        res.status(400).send(error.message);
    } else if (error.message.includes("User is unauthorized")) {
        res.status(404).send(error.message);
    } else {
        res.status(500).sens(error.message);
    }
};

module.exports = errorHandler;