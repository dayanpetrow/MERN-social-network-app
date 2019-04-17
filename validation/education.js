const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
    data.fromDate = !isEmpty(data.fromDate) ? data.fromDate : '';

    if(Validator.isEmpty(data.school)) {
        errors.school = "School is a required field!"
    }

    if(Validator.isEmpty(data.degree)) {
        errors.degree = "Degree is a required field!"
    }

    if(Validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = "Field of study is a required field!"
    }

    if(Validator.isEmpty(data.fromDate)) {
        errors.fromDate = "Start date is a required field!"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}