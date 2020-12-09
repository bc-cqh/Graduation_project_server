import { Application } from 'egg';
import moment from 'moment';
import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
export default (app: Application) => {
  const {
    STRING, INTEGER,
    BIGINT, DATE, Model,
  } = app.Sequelize;
  class Teacher extends Model {
    public id!: string;
    public userId!: string;
    public userName!: string;
    public name!: string;
    public collegeId!: string;
    public readonly ctime!: number;
    public readonly mtime!: number;

    static async createStudent(value: object, options?: CreateOptions) {
      return this.create(value, options);
    }

    static async findOneStudent(options: FindOptions) {
      return this.findOne(options);
    }

    static async findAllStudent() {}

    static async updateStudent(values: object, options: UpdateOptions) {
      return this.update(values, options);
    }

    static async destroyStudent(options: DestroyOptions) {
      return this.destroy(options);
    }

  }

  Teacher.init({
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
    userName: {
      type: STRING(32),
      allowNull: false,
      field: 'user_name',
      comment: '用户名',
    },
    name: {
      type: STRING,
      allowNull: false,
      comment: '姓名',
    },
    collegeId: {
      type: STRING,
      allowNull: false,
      field: 'college_id',
      comment: '学院id',
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
        Teacher.prototype.setDataValue.bind(this)('mtime', moment().valueOf());
      },
    },
    dtime: {
      type: DATE,
      comment: '删除时间',
    },
  }, {
    sequelize: app.model,
    modelName: 'teacher',
    comment: '教师表',
    tableName: 'bas_teacher',
  });
  Teacher.sync();
  return Teacher;
};
