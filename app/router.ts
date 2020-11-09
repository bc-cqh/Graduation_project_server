import { Application } from 'egg';
import { Routers } from './common/interface';
import fs from 'fs';
import path from 'path';

export default (app: Application) => {
  const { router, config } = app;
  if (config.router) router.prefix(config.router.prefix);

  const routers: Routers[] = [];
  const routerPath = path.join(__dirname, 'routers');
  const files = fs.readdirSync(routerPath);
  files.forEach(file => {
      const result = require(path.join(routerPath, file));
      routers.push(...result.default(app));
  });
  routers.forEach(item => {
    const result: any[] = [];

    if (item.schema) result.push(app.middleware.paramValid(item.schema));
    if (item.authentication === undefined) result.push(app.middleware.checkLogin());

    result.push(item.controller);
    router[item.method](item.path, ...result);
  });
  return router;
};
