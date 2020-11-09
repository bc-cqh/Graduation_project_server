import { Application } from 'egg';
import moment from 'moment';
import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import bcrypt from 'bcryptjs';
export default (app: Application) => {
  const {
    STRING, INTEGER, CHAR,
    BIGINT, DATE, Model,
  } = app.Sequelize;
  class User extends Model {
    public id!: string;
    public userId!: string;
    public organizationId!: string | null;
    public mobile!: string;
    public password!: string;
    public nickName!: string;
    public dingId!: string;
    public avatar!: string;
    public email!: string;
    public readonly ctime!: number;
    public readonly mtime!: number;

    static async createUser(value: object, options?: CreateOptions) {
      return this.create(value, options);
    }

    static async findOneUser(options: FindOptions) {
      return this.findOne(options);
    }

    static async findAllUser() {}

    static async updateUser(values: object, options: UpdateOptions) {
      return this.update(values, options);
    }

    static async destroyUser(options: DestroyOptions) {
      return this.destroy(options);
    }

  }

  User.init({
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键自增 id',
    },
    userId: {
      type: STRING(32),
      allowNull: false,
      field: 'user_id',
      comment: '用户id',
      defaultValue: () => app.uuid,
    },
    organizationId: {
      type: STRING(32),
      allowNull: true,
      field: 'organization_id',
      comment: '组织id',
      defaultValue: () => null,
    },
    dingUnionid: {
      type: STRING,
      allowNull: true,
      field: 'ding_union_id',
      comment: '钉钉 id',
      defaultValue: null,
    },
    email: {
      type: STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: '电子邮箱',
    },
    avatar: {
      type: STRING,
      allowNull: true,
      comment: '头像',
      defaultValue: null,
    },
    mobile: {
      type: CHAR(20),
      allowNull: false,
      comment: '手机号',
      unique: true,
    },
    nickName: {
      type: STRING(32),
      allowNull: true,
      comment: '昵称',
    },
    password: {
      type: STRING,
      allowNull: true,
      comment: '登录密码',
      set(value) {
        if (value) {
          const salt = bcrypt.genSaltSync(8);
          const password = bcrypt.hashSync(value, salt);
          User.prototype.setDataValue.bind(this)('password', password);
        }
      },
    },

    ctime: {
      type: BIGINT,
      allowNull: false,
      comment: '创建时间',
      defaultValue: () => moment().valueOf(),
    },
    mtime: {
      type: BIGINT,
      allowNull: false,
      comment: '修改时间',
      defaultValue: () => moment().valueOf(),
      set() {
        User.prototype.setDataValue.bind(this)('mtime', moment().valueOf());
      },
    },
    dtime: {
      type: DATE,
      comment: '删除时间',
    },
  }, {
    sequelize: app.model,
    modelName: 'user',
    comment: '用户表',
    tableName: 'bas_user',
  });
  User.sync();
  return User;
};
