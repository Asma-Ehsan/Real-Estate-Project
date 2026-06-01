// Creates a custom error object with status code and message, which is passed using next(error) to the global error-handling middleware in the index.js file.
//Instead of writing error logic again and again, you call this function and get: a message and a status code

export const errorHandler = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode;  // Add custom status code (not built-in)
    error.message = message; // Set custom error message
    return error;
}

export default errorHandler;