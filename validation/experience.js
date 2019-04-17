const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.fromDate = !isEmpty(data.fromDate) ? data.fromDate : '';

    if(Validator.isEmpty(data.title)) {
        errors.title = "Job title is a required field!"
    }

    if(Validator.isEmpty(data.company)) {
        errors.company = "Company name is a required field!"
    }

    if(Validator.isEmpty(data.fromDate)) {
        errors.fromDate = "Start date is a required field!"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}