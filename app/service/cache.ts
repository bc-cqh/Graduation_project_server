import { Service, Context } from 'egg';

export default class Cache extends Service {
  expire: number;
  instance: any;
  constructor(ctx: Context) {
    super(ctx);
    this.expire = 24 * 60 * 60;
    this.instance = this.app.redis.get('cache');
  }

  async get(key: string) {
    if (this.instance) {
      const result = await this.instance.get(key);
      return JSON.parse(result);
    }
    return null;
  }

  async set(key: string, value: object, expire?: number) {
    if (this.instance) {
      return await this.instance.set(key, JSON.stringify(value), 'EX', expire || this.expire);
    }
    return null;
  }

  async del(key: string) {
    if (this.instance) {
      return await this.instance.del(key);
    }
    return null;
  }
}
