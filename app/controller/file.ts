import { Controller } from 'egg';
import xlsx from 'xlsx';
export default class FileController extends Controller {
  public async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    let sheetNames;
    stream.on('data', chunk => {
      const workbook = xlsx.read(chunk, { type: 'buffer' });
      sheetNames = workbook.SheetNames;
   });
    console.log(sheetNames);
    const result = xlsx.read(stream,{
      type:'buffer',
    });
    console.log(result);
    console.log(stream);
    ctx.body = stream;
  }
}
