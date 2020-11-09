import { Context } from 'egg';

export default function checkLogin(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    await ctx.service.account.checkLogin();
    await next();
  };
}
