import { Service } from 'egg';
import SysError from '../common/sys_error';
import bcrypt from 'bcryptjs';

interface IloginParams {
  platform: string;
  loginInfo: {
    mobile: string;
    password: string;
  };
}

export default class User extends Service {
  public async login(params: IloginParams) {
    const { ctx: { model: { User } }, app } = this;
    const { platform, loginInfo } = params;
    let user: any;
    const attributes = [
      'userId', 'organizationId', 'avatar',
      'mobile', 'email', 'password',
    ];
    if (platform === 'administrators') {
      user = await this.register(loginInfo.mobile, loginInfo.password);
    } else if (platform === 'user') {
      await this.isLocked('login', loginInfo);
      user = await User.findOneUser({
        attributes,
        where: {
          mobile: loginInfo.mobile,
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
    }
    delete user.password;
    // return await this.getUserPermission(user);
    return user;
  }
  // 判断是否被锁
  public async isLocked(type: string, waveview: any) {
    const { service, app } = this;
    const result = await service.cache.get(`${type}_${waveview.mobile}`);
    if (result && result.count === 5) {
      throw new SysError(app.errMsg.ERROR_PASSWORD_FIVE, app.errCode.ERROR_PASSWORD_FIVE);
    }
  }
  // 对输入错误的进行计数
  public async errorCount(type: string, waveview: any) {
    const { service, app } = this;
    const result = await service.cache.get(`${type}_${waveview.mobile}`);
    if (!result) {
      await service.cache.set(`${type}_${waveview.mobile}`, { count: 1 }, 60 * 60 * 24);
    } else {
      await service.cache.set(`${type}_${waveview.mobile}`, { count: ++result.count });
      if (result.count === 5) {
        throw new SysError(app.errMsg.ERROR_PASSWORD_FIVE, app.errCode.ERROR_PASSWORD_FIVE);
      }
    }
  }
  public async register(mobile,password) {
    const { ctx:{ model: { User } } } = this;
    const result = await User.createUser({
      mobile,
      password,
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
    if (!ctx.session.user) {
      throw new SysError(app.errMsg.ERROR_USER_NOT_LOGGED, app.errCode.ERROR_USER_NOT_LOGGED);
    } else {
      return ctx.session.user;
    }
  }
}
