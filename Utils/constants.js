const keysToDelete = ['sort', 'page', 'fields'];
const validationError = 'ValidationError';
const jwtError = 'JsonWebTokenError';
const tokenExpiredError = 'TokeExpiredError';
const duplicateKey = 11000;

module.exports = {
    keysToDelete: keysToDelete,
    validationError: validationError,
    duplicateKey: duplicateKey,
    tokenExpiredError: tokenExpiredError,
    jwtError: jwtError,
}