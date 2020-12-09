// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportFile from '../../../app/controller/file';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    file: ExportFile;
  }
}
