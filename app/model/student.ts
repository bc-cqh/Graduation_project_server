import { Application } from 'egg';
import moment from 'moment';
import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
export default (app: Application) => {
  const {
    STRING, INTEGER,
    BIGINT, DATE, Model,
  } = app.Sequelize;
  class Student extends Model {
    public id!: string;
    public userId!: string;
    public userName!: string;
    public name!: string;
    public collegeId!: string;
    public classId!: string;
    public grade!: string;
    public class!: string;
    public timetable!: string;
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

  Student.init({
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
    collegeId: {
      type: STRING,
      allowNull: false,
      field: 'college_id',
      comment: '学院id',
    },
    classId: {
      type: STRING,
      allowNull: false,
      field: 'class_id',
      comment: '班级id',
    },
    grade: {
      type: INTEGER,
      allowNull: false,
      comment: '学分',
    },
    timetable: {
      type: STRING,
      allowNull: false,
      defaultValue: () => '0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;0,0,0,0,0,0,0,0,0,0;',
      comment: '课表',
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
        Student.prototype.setDataValue.bind(this)('mtime', moment().valueOf());
      },
    },
    dtime: {
      type: DATE,
      comment: '删除时间',
    },
  }, {
    sequelize: app.model,
    modelName: 'student',
    comment: '用户表',
    tableName: 'bas_student',
  });
  Student.sync();
  return Student;
};
