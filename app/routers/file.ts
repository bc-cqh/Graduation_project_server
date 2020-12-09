import { Application } from 'egg';
import { Routers } from '../common/interface';
// import * as schema from '../contract/request/account';

export default function fileRouter(app: Application): Routers[] {
  const { controller } = app;
  return [
    {
      method: 'post',
      path: '/upload',
      authentication: false,
      controller: controller.file.upload,
    },

  ];
}
