import Joi from '@hapi/joi';

const login = {
  body: {
    userName: {
      type:'string',
      validate: Joi.string().required(),
    },
    password: {
      type:'string',
      validate: Joi.string().required(),
    },
    autoLogin: {
      type:'bool',
      validate: Joi.bool().required(),
    },
  },

};
const register = {
  body: {
    userName: {
      type: 'string',
      validate: Joi.string().required(),
    },
    password: {
      type: 'string',
      validate: Joi.string().required(),
    },
    currentAuthority: {
      type: 'string',
      validate: Joi.string().required(),
    },
  },
};

const unlock = {
  body: {
    userName: {
      type: 'string',
      validate: Joi.string().required(),
    },
  },
};
export {
  login,
  register,
  unlock,
};
