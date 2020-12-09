// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCourse from '../../../app/model/course';
import ExportStudent from '../../../app/model/student';
import ExportTeacher from '../../../app/model/teacher';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Course: ReturnType<typeof ExportCourse>;
    Student: ReturnType<typeof ExportStudent>;
    Teacher: ReturnType<typeof ExportTeacher>;
    User: ReturnType<typeof ExportUser>;
  }
}
