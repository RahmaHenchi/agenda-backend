const Joi = require('joi');

const eventValidator = Joi.object({
    title: Joi.string().required().min(2).max(50),
    notes: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required()
});

const registerValidator = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4)
})

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = {
    eventValidator,
    registerValidator,
    loginValidator
}