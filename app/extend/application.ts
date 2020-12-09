import { Application } from 'egg';
import UUID from 'uuid';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import SysError from '../common/sys_error';

export default {
  get uuid() {
    return UUID.v4().replace(/\-/g, '');
  },
  errCode: {
    SUCCESS_OK: 'OK',
    ERROR_UNKNOWN: 'ERROR_UNKNOWN',
    ERROR_PASSWORD: 'ERROR_PASSWORD',
    ERROR_PASSWORD_FIVE: 'ERROR_PASSWORD_FIVE',
    ERROT_NOT_ROLE: 'ERROT_NOT_ROLE',
    ERROR_DELETE_ART: 'ERROR_DELETE_ART',
    ERROR_AUTH_LOGIN: 'ERROR_AUTH_LOGIN',
    ERROR_NOT_ONLINE: 'ERROR_NOT_ONLINE',
    ERROR_NOT_TMPLATE: 'ERROR_NOT_TMPLATE',
    ERROR_DELETE_FILE: 'ERROR_DELETE_FILE',
    ERROR_UPLOAD_FILE: 'ERROR_UPLOAD_FILE',
    ERROR_PHONE_EXISTS: 'ERROR_PHONE_EXISTS',
    ERROR_PROJECT_NOT_ADMIN: 'ERROR_PROJECT_NOT_ADMIN',
    ERROR_PROJECT_NOT_EXIST: 'ERROR_PROJECT_NOT_EXIST',
    ERROR_PROJECT_ADMIN_LEAVE: 'ERROR_PROJECT_ADMIN_LEAVE',
    ERROR_DELETE_PROJECT: 'ERROR_DELETE_PROJECT',
    ERROR_UPDATE_PROJECT: 'ERROR_UPDATE_PROJECT',
    ERROR_FILE_NOT_EXIST: 'ERROR_FILE_NOT_EXIST',
    ERROR_USER_NOT_EXIST: 'ERROR_USER_NOT_EXIST',
    ERROR_USER_NOT_LOGGED: 'ERROR_USER_NOT_LOGGED',
    ERROR_PHONE_NOT_EXISTS: 'ERROR_PHONE_NOT_EXISTS',
    ERROR_NOT_ART_NOT_EXIST: 'ERROR_NOT_ART_NOT_EXIST',
    ERROR_ART_PUBLISH_TOKEN: 'ERROR_ART_PUBLISH_TOKEN',
    ERROR_ONLINE_ART_VERSION: 'ERROR_ONLINE_ART_VERSION',
    ERROR_NO_SUCH_PERMISSION: 'ERROR_NO_SUCH_PERMISSION',
    ERROR_ART_PASSWORD_EXPORED: 'ERROR_ART_PASSWORD_EXPORED',
    ERROR_ART_VERSION_UP_LIMIT: 'ERROR_ART_VERSION_UP_LIMIT',
    ERROR_UNPUBLISH_ART_VERSION: 'ERROR_UNPUBLISH_ART_VERSION',
    ERROR_NOT_ONLINE_ART_VERSION: 'ERROR_NOT_ONLINE_ART_VERSION',
    ERROR_ORGANIZATION_REMOVE: 'ERROR_ORGANIZATION_REMOVE',
    ERROR_ORGANIZATION_NOT_EXIST: 'ERROR_ORGANIZATION_NOT_EXIST',
    ERROR_ORGANIZATION_ADMIN_EXIT: 'ERROR_ORGANIZATION_ADMIN_EXIT',
    ERROT_ORGANIZATION_USER: 'ERROT_ORGANIZATION_USER',
    ERROR_ORGANIZATION_REPEAT_APPROLEVAL: 'ERROR_ORGANIZATION_REPEAT_APPROLEVAL',
    ERROR_DATA_NOT_EXIST: 'ERROR_DATA_NOT_EXIST',
    ERROR_DELETE_ORGANIZATION: 'ERROR_DELETE_ORGANIZATION',
    ERROR_INVITE_CODE_IS_USED: 'ERROR_INVITE_CODE_IS_USED',
    ERROR_INVITE_CODE_NOT_EXIST: 'ERROR_INVITE_CODE_NOT_EXIST',
    ERROR_VERIFICATION_CODE: 'ERROR_VERIFICATION_CODE',
    ERROR_USERNAME_NOT_LOCKED: 'ERROR_USERNAME_NOT_LOCKED',

  },
  errMsg: {
    ERROR_PASSWORD: '密码不正确',
    ERROR_PASSWORD_FIVE: '密码输入错误5次，账户临时限制登录，请联系管理员',
    ERROT_NOT_ROLE: '用户角色不存在，请联系管理员',

    ERROR_AUTH_LOGIN: '密码错误，请重新输入',
    ERROR_DELETE_FILE: '删除文件失败',
    ERROR_UPLOAD_FILE: '上传文件失败，请重新尝试',
    ERROR_PHONE_EXISTS: '该号码已经注册',
    ERROR_FILE_NOT_EXIST: '文件不存在，请联系管理员',
    ERROR_USER_NOT_LOGGED: '用户未登录或超时',
    ERROR_USER_NOT_EXIST: '用户不存在，请联系管理员',
    ERROR_PHONE_NOT_EXISTS: '该号码未注册',
    ERROR_ART_PUBLISH_TOKEN: '认证秘钥不存在',
    ERROR_NO_SUCH_PERMISSION: '无此权限，请联系管理员',
    ERROR_ONLINE_ART_VERSION: '该大屏下已有版本在线，请先下线再操作',
    ERROR_ART_PASSWORD_EXPORED: '大屏密码已过期',
    ERROR_ART_VERSION_UP_LIMIT: '该大屏发布版本已上限，最大限制为5个版本',
    ERROR_UNPUBLISH_ART_VERSION: '请先下线版本，再删除',
    ERROR_NOT_ONLINE_ART_VERSION: '该版本已经处于下线状态，无需再次下线',
    ERROR_ORGANIZATION_REMOVE: '删除组织成员失败',
    ERROR_ORGANIZATION_NOT_EXIST: '组织不存在，请联系管理员',
    ERROR_ORGANIZATION_ADMIN_EXIT: '组织创建者不可退出',
    ERROT_ORGANIZATION_USER: '审核用户已不存在，请联系管理员',
    ERROR_ORGANIZATION_REPEAT_APPROLEVAL: '该审批已经通过或拒绝，无需重复操作',
    ERROR_DELETE_ORGANIZATION: '删除组织失败',
    ERROR_DATA_NOT_EXIST: '数据不存在，请联系管理员',
    ERROR_INVITE_CODE_IS_USED: '邀请码已经使用过',
    ERROR_INVITE_CODE_NOT_EXIST: '邀请码不存在',
    ERROR_VERIFICATION_CODE: '验证码错误',
    ERROR_USERNAME_NOT_LOCKED: '账户没有被锁',
  },
  /**
   *
   * 判断mac地址满足
   * @param {string[]} macAddress 客户硬件mac地址
   * @param {string[]} macList 当前机器可用网卡的mac地址
   * @return {Boolean} 是否满足
   */
  isMac: (macAddress: never[], macList: string[]) => {
    for (const mac of macAddress) {
      if (macList.includes(mac)) {
        return true;
      }
    }
    return false;
  },
  killApp(message, app: Application) {
    app.messenger.sendToApp('kill', {
      message,
    });
  },

  verifyToken(token: string, secret: string, curPassword: string): Promise<object> {
    try {
      const decoded: any = jwt.verify(token, secret);
      if (decoded.password !== curPassword) {
        throw new SysError(this.errMsg.ERROR_ART_PASSWORD_EXPORED, this.errCode.ERROR_ART_PASSWORD_EXPORED);
      }
      return decoded;
    } catch (error) {
      throw new SysError(error.message, this.errCode.ERROR_ART_PASSWORD_EXPORED);
    }
  },
  signToken(data: string | object | Buffer, secret: string, options?: jwt.SignOptions): string {
    return jwt.sign(data, secret, options);
  },
  getBytes(num: number) {
    return crypto
      .randomBytes(num)
      .toString('base64')
      .replace(/\//g, '')
      .replace(/\+/g, '')
      .replace(/\=/g, '');
  },

  cryptoDecrypt(password, secret): string {
    return CryptoJS.AES.decrypt(password, Buffer.from(secret, 'base64').toString()).toString(CryptoJS.enc.Utf8);
  },

};
