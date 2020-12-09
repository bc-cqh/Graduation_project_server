/**
 * 统一参数校验中间件
 */

import { Context } from 'egg';
import Joi from '@hapi/joi';

interface ISchema {
  query: object;
  router: object;
  body: object;
  headers: object;
}

const toJoi = (schemas: ISchema) => {
  const result = {};
  const schemaKeys = Object.keys(schemas);
  schemaKeys.forEach(key => {
    const schema = schemas[key];
    const paramKey = Object.keys(schema);
    const object = {};
    paramKey.forEach(vk => {
      const value = schema[vk];
      if (typeof value === 'object' && !value.validate) {
        let buildJOi = Joi[value.type]();
        if (value.allow) {
          buildJOi = buildJOi.allow(value.allow);
        }
        if (value.min) {
          buildJOi = buildJOi.min(value.min);
        }
        if (value.max) {
          buildJOi = buildJOi.max(value.max);
        }
        if (value.default !== undefined) {
          buildJOi = buildJOi.default(value.default);
        }
        if (value.empty !== undefined) {
          buildJOi = buildJOi.empty(value.empty);
        }
        if (value.required) {
          buildJOi = buildJOi.required();
        }
        object[vk] = buildJOi;
      } else {
        object[vk] = value.validate;
      }
    });
    result[key] = Joi.object(object);
  });

  return result;
};

export default function paramValid(schema): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const joiSchema = toJoi(schema);

    const reqParams = {
      headers: ctx.headers,
      router: ctx.params,
      query: ctx.query,
      body: ctx.request.body,
    };
    const schemaKeys: string[] = Object.keys(joiSchema);
    if (schema && schemaKeys.length > 0) {
      schemaKeys.forEach(item => {
        const validResult = joiSchema[item].validate(reqParams[item], { allowUnknown: true });
        if (validResult.error) {
          ctx.logger.warn('[param error]: ', validResult.error.message);
          ctx.throw(500, validResult.error.message);
        }
        reqParams[item] = validResult.value;
      });
    }

    ctx.reqParams = reqParams;
    await next();
  };
}
