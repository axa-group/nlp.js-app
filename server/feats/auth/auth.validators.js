const Joi = require('joi');

module.exports = {
  login: {
    payload: (() => ({
      email: Joi.string().email({ minDomainAtoms: 2 }).required().trim().description('e-mail to log in'),
      password: Joi
        .string()
        .required()
        .description('Password to log in')
    }))(),
  },
  register: {
    payload: (() => ({
      email: Joi.string().email({ minDomainAtoms: 2 }).required().trim().description('e-mail to register'),
      password: Joi
          .string() // TODO: define pattern and min length
          .required()
          .description('Password to register')
    }))()
  }
};
