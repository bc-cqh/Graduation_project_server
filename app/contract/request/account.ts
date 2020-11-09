import Joi from '@hapi/joi';

const login = {
  body: {
    role: {
      type: 'string',
      validata: Joi.string().required(),
    },
  },
};
const register = {
  body: {
    mobile: {
      type: 'string',
      validate: Joi.string().regex(/^1([3578][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).required(),
    },
    password: {
      type: 'string',
      validate: Joi.string().required(),
    },
  },
};
export {
  login,
  register,
};
