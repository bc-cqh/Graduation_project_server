
import { Application, IBoot, EggAppConfig } from 'egg';

export default class OnerBoot implements IBoot {
  app: Application;
  config: EggAppConfig;

  constructor(app: Application) {
    this.app = app;
    this.config = app.config;
  }
  configWillLoad() {
    if (this.config.env !== 'prod') {
      return;
    }
    const configPath = process.env.CONFIG_PATH || '/opt/conf/waveview/config.js';

    try {
      const configGlobal = require(configPath);

      if (configGlobal?.dhp?.enable) {
        this.config.dhpAuth = {
          enable: true,
        };
      }

      this.config.sequelize = Object.assign(this.config.sequelize, configGlobal.backend.sequelize);
      this.config.cluster = Object.assign(this.config.cluster, configGlobal.backend.cluster);
      this.config.redis = Object.assign(this.config.redis, configGlobal.backend.redis);
      this.config.router = Object.assign(this.config.router, configGlobal.backend.router);

    } catch (error) {
      throw error;
    }
  }

  configDidLoad() {
    // this.app.isStopService(this.config.license, this.app);
  }

  async didReady() {
    this.app.messenger.on('kill', data => {
      this.app.logger.error(process.pid, data.message);
      process.exitCode = 1;
      process.kill(process.pid);
    });
  }

}
