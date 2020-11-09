// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckLogin from '../../../app/middleware/check_login';
import ExportParamValid from '../../../app/middleware/param_valid';
import ExportResponseFormat from '../../../app/middleware/response_format';

declare module 'egg' {
  interface IMiddleware {
    checkLogin: typeof ExportCheckLogin;
    paramValid: typeof ExportParamValid;
    responseFormat: typeof ExportResponseFormat;
  }
}
