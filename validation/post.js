const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text, { min: 2, max: 300 })) {
        errors.text = "Comment must be between 2 and 300 characters!";
    }

    if(Validator.isEmpty(data.text)) {
        errors.text = "Comment content is a required field!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}