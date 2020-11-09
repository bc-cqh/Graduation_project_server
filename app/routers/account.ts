import { Application } from 'egg';
import { Routers } from '../common/interface';
import * as schema from '../contract/request/account';

export default function accountRouter(app: Application): Routers[] {
  const { controller } = app;
  return [
    {
      method: 'get',
      path: '/login',
      schema: schema.login,
      authentication: false,
      controller: controller.account.login,
    },
    {
      method: 'post',
      path: '/register',
      schema: schema.register,
      authentication: false,
      controller: controller.account.register,
    },

  ];
}
