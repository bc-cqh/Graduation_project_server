import { Application } from 'egg';
import { Routers } from '../common/interface';
import * as schema from '../contract/request/account';

export default function accountRouter(app: Application): Routers[] {
  const { controller } = app;
  return [
    {
      method: 'post',
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
    {
      method: 'post',
      path: '/unlock',
      schema: schema.unlock,
      authentication: false,
      controller: controller.account.unlock,
    },
    {
      method: 'get',
      path: '/currentUser',
      authentication: false,
      controller: controller.account.currentUser,
    },

  ];
}
