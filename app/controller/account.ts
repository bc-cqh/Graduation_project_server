import { Controller } from 'egg';

export default class UserController extends Controller {
  public async login() {
    const { ctx, service } = this;
    const { platform, loginInfo, isRememberMe } = ctx.reqParams.body;
    const user = await service.account.login({ platform, loginInfo });
    if (!user.isRegister) {
      ctx.body = user;
    } else {
      await service.cache.set(`user-${user.userId}`, {
        userId: user.userId,
        organizationId: user.organizationId,
      });
      ctx.body = ctx.session.user = user;
      if (isRememberMe) ctx.session.maxAge = 24 * 60 * 60 * 1000 * 30; // 三十天
    }
  }
  public async register() {
    const { ctx, service } = this;
    const { mobile, password } = ctx.reqParams.body;
    const user: any = await service.account.register(mobile, password);
    ctx.session.user = user;
    if (!user.isRegister) {
      ctx.body = user;
    } else {
      await service.cache.set(`user-${user.userId}`, {
        userId: user.userId,
        organizationId: user.organizationId,
      });
    }
    ctx.body = {
      userId: user.userId,
    };
  }
}
