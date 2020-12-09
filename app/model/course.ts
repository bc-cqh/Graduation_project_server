import { Application } from 'egg';
import moment from 'moment';
import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
export default (app: Application) => {
  const {
    STRING, INTEGER, CHAR,
    BIGINT, DATE, Model,
  } = app.Sequelize;
  class Course extends Model {
    public id!: string;
    public college_id!: string;
    public course_id!: string;
    public course_name!: string;
    public class_id!: string;
    public teacher_name!: string;
    public credit!: string;
    public campus!: string;
    public time_1!: string;
    public time_2!: string;
    public time_3!: string;
    public classroom_1!: string;
    public classroom_2!: string;
    public classroom_3!: string;
    public opening!: string;
    public capacity!: string;
    public student_count!: string;
    public course_type!: string;
    public term!: string;
    public is_main!: boolean;
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

  Course.init({
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键自增 id',
    },
    collegeId: {
      type: STRING(32),
      allowNull: false,
      field: 'college_id',
      comment: '学院id',
      defaultValue: () => null,
    },
    courseId: {
      type: STRING(32),
      allowNull: true,
      field: 'course_id',
      comment: '课程id',
      defaultValue: () => null,
    },
    courseName: {
      type: STRING,
      allowNull: false,
      field: 'course_name',
      comment: '课程名称',
    },
    teacherName: {
      type: STRING,
      allowNull: false,
      field: 'teacher_name',
      comment: '任课教师姓名',
    },
    credit: {
      type: INTEGER,
      allowNull: false,
      comment: '学分',
    },
    campus: {
      type: CHAR(20),
      allowNull:true,
      comment: '校区',
    },
    time1: {
      type: STRING(32),
      allowNull: false,
      field: 'time_1',
      comment: '上课时间1',
    },
    time2: {
      type: STRING(32),
      allowNull: true,
      field: 'time_2',
      comment: '上课时间2',
    },
    time3: {
      type: STRING(32),
      allowNull: true,
      field: 'time_3',
      comment: '上课时间3',
    },
    classRoom1: {
      type: STRING(20),
      allowNull: false,
      field: 'classroom_1',
      comment: '上课教室1',
    },
    classRoom2: {
      type: STRING(20),
      allowNull: false,
      field: 'classroom_2',
      comment: '上课教室2',
    },
    classRoom3: {
      type: STRING(20),
      allowNull: false,
      field: 'classroom_3',
      comment: '上课教室3',
    },
    opening: {
      type: STRING,
      allowNull: false,
      comment: '开课时间',
    },
    capacity: {
      type: STRING,
      allowNull: false,
      comment: '课程容量',
    },
    studentCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'student_count',
      comment: '选课学生数量',
    },
    courseType: {
      type: STRING,
      allowNull: false,
      defaultValue: () => '非必修课',
      comment: '课程类型',
      field: 'course_type',
    },
    term: {
      type: STRING,
      allowNull: false,
      comment: '学期',
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
        Course.prototype.setDataValue.bind(this)('mtime', moment().valueOf());
      },
    },
    dtime: {
      type: DATE,
      comment: '删除时间',
    },
  }, {
    sequelize: app.model,
    modelName: 'course',
    comment: '选课表',
    tableName: 'bas_course',
  });
  Course.sync();
  return Course;
};
