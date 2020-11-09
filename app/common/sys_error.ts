export default class SysError extends Error {
  code: any;
  constructor(message: string, errorCode: any) {
    super(message);
    this.code = errorCode;
  }
}
