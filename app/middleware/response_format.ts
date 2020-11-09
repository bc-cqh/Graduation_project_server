/**
 * response 格式化中间件
 */
'use strict';

import { Context } from 'egg';
import SysError from '../common/sys_error';

export default function responseFormat(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
      if (ctx.status === 404) {
        throw new SysError(`path ${ctx.url} Not Found`, 404);
      }

      if (ctx.type === 'application/json' && !ctx.path.endsWith('swagger-doc')) {
        ctx.body = {
          code: ctx.app.errCode.SUCCESS_OK,
          success: true,
          content: ctx.body,
        };
      }
    } catch (err) {
      ctx.logger.error('[server error]: ', ctx.status || 500, ctx.reqParams || {}, err);
      ctx.status = 200;

      const result = {
        code: err.code || ctx.app.errCode.ERROR_UNKNOWN,
        success: false,
        message: err.message,
      };

      ctx.body = result;
    }
    ctx.logger.info(ctx.status);
  };
}
