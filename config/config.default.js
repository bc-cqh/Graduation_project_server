/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1604654244471_5708';

  // add your middleware config here
  config.middleware = ['responseFormat'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  config.router = {
    prefix: '/api/'
  }
  config.session = {
    name: 'session',
    key: 'MY_SERVER',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
    renew: false,
  };
  config.secret = 'd2F2ZXZpZXc=';
  config.cluster = {
    listen: {
      port: 9987,
      hostname: '0.0.0.0',
    },
  };
  config.sessionRedis = {
    name: 'session',
  };

  config.redis = {
    clients: {
      session: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      },
      cache: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 1,
      },
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'my_server',
    logging: false,
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'ctime',
      updatedAt: 'mtime',
      paranoid: true,
      deletedAt: 'dtime',
    },
    dialectOptions: {
      decimalNumbers: true,
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.multipart = {
    mode: 'stream',
    whitelist: [
      '.xlsx',
      '.xls',
      '.png',
      '.jpeg'
    ],

  }
  return {
    ...config,
    ...userConfig,
  };
};
