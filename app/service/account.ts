import { Service } from 'egg';
import SysError from '../common/sys_error';
import bcrypt from 'bcryptjs';
interface IloginInfo {
  userName: string;
  password: string;
}
export default class User extends Service {
  /**
   *
   * @param {IloginParams} params
   * 登录
   */
  public async login(loginInfo:IloginInfo) {
    const { ctx: { model: { User } }, app } = this;
    let user: any;
    const attributes = [
      'userId', 'organizationId', 'avatar',
      'mobile', 'email', 'password','currentAuthority',
    ];

    await this.isLocked('login', loginInfo.userName);
    user = await User.findOneUser({
        attributes,
        where: {
          userName: loginInfo.userName,
        },
        raw: true,
      });
      // 账号不存在
    if (!user) {
        throw new SysError(app.errMsg.ERROR_PHONE_NOT_EXISTS, app.errCode.ERROR_PHONE_NOT_EXISTS);
      }
    const correct = bcrypt.compareSync(loginInfo.password, user.password);
      // 密码不正确
    if (!correct) {
        await this.errorCount('login', loginInfo);
        throw new SysError(app.errMsg.ERROR_PASSWORD, app.errCode.ERROR_PASSWORD);
      }
    delete user.password;
    // return await this.getUserPermission(user);
    return user;
  }
  /**
   *
   * @param {string} type
   * @param {string} userName
   * 判断是否被锁
   */
  public async isLocked(type: string, userName: string) {
    const { service, app } = this;
    const result = await service.cache.get(`${type}_${userName}`);
    if (result && result.count === 5) {
      throw new SysError(app.errMsg.ERROR_PASSWORD_FIVE, app.errCode.ERROR_PASSWORD_FIVE);
    }
  }
  // 对输入错误的进行计数
  public async errorCount(type: string, loginInfo: any) {
    const { service, app } = this;
    const result = await service.cache.get(`${type}_${loginInfo.mobile}`);
    if (!result) {
      await service.cache.set(`${type}_${loginInfo.mobile}`, { count: 1 }, 60 * 60 * 24);
    } else {
      await service.cache.set(`${type}_${loginInfo.mobile}`, { count: ++result.count });
      if (result.count === 5) {
        throw new SysError(app.errMsg.ERROR_PASSWORD_FIVE, app.errCode.ERROR_PASSWORD_FIVE);
      }
    }
  }
  public async register(userName, password, currentAuthority) {
    const { ctx:{ model: { User } } } = this;
    const result = await User.createUser({
      userName,
      password,
      currentAuthority,
    });
    return result;
  }
  public async isRegister(primaryKey: string, primaryValue: string) {
    const { ctx: { model: { User } } } = this;

    const result = await User.findOneUser({
      attributes: [ primaryKey ],
      where: {
        [primaryKey]: primaryValue,
      },
    });
    return result ? true : false;
  }
  public async checkLogin() {
    return this.getUser;
  }
  public get getUser() {
    const { ctx, app } = this;
    console.log(ctx.session.user);
    if (!ctx.session.user) {
      throw new SysError(app.errMsg.ERROR_USER_NOT_LOGGED, app.errCode.ERROR_USER_NOT_LOGGED);
    } else {
      return ctx.session.user;
    }
  }
  public async unlock(userName) {
    const { service ,app } = this;
    const result = await service.cache.get(`login_${userName}`);
    if(result && result.count === 5) {
      return await service.cache.del(`login_${userName}`);
    } else {
      throw new SysError(app.errMsg.ERROR_USERNAME_NOT_LOCKED,app.errCode.ERROR_USERNAME_NOT_LOCKED);
    }
  }
}
