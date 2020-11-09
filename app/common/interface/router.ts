type Method = 'get' | 'post' | 'put' | 'delete';
export interface Routers {
  method: Method;
  path: string;
  authentication?: boolean;
  schema?: object;
  middleware?: [Promise<void>];
  controller: any;
}
