import { Controller } from 'egg';

export default class UserController extends Controller {
  /**
   * @summary 登录
   * @description 登录
   * @router post /login
   */
  public async login() {
    const { ctx, service } = this;
    const { password, userName, autoLogin } = ctx.reqParams.body;
    const loginInfo = {
      password,
      userName,
    };
    const user = await service.account.login(loginInfo);
    if (!service.account.isRegister('userId',user.userId)) {
      ctx.body = user;
    } else {
      await service.cache.set(`user-${user.userId}`, {
        userId: user.userId,
        organizationId: user.organizationId,
      });
      if (autoLogin) ctx.session.maxAge = 24 * 60 * 60 * 1000 * 30; // 三十天
      console.log(user);
      ctx.body = ctx.session.user = user;
    }
  }
  /**
   * @summary 注册
   * @description 注册
   * @router post /register
   */
  public async register() {
    const { ctx, service } = this;
    const { userName, password, currentAuthority } = ctx.reqParams.body;
    const user: any = await service.account.register(userName, password,currentAuthority);
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
  /**
   * @summary 解锁
   * @router post /unlock
   */
  public async unlock() {
    const { ctx,service } = this;
    const { userName } = ctx.reqParams.body;
    ctx.body = await service.account.unlock(userName);
  }
  /**
   * @summary 获取当前用户
   * @router get /currentUser
   */
  public async currentUser() {
    const { ctx,service } = this;
    ctx.body = await service.account.checkLogin();
  }

}
