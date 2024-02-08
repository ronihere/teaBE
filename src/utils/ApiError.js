class ApiError extends Error{
    constructor(
        statusCode,
        message= 'something went wrong',
        errors = [],
        stack=""
    ) {
        super(message)
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.stack = stack;
        this.success= false
    }
}

export {ApiError}