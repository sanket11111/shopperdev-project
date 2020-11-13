class ErrorResponse extends Error {
    constructor(message, statusCode) {
       super(message) // passing message into the message property allready there in Error class we hve extended
       this.statusCode = statusCode
    }
}

module.exports = ErrorResponse