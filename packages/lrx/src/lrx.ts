import * as fs from "fs";
import {source, parse} from "./parser";
import {MathEx} from './math-ex';
import {LRXFile} from './lrx-file';

export class Lrx {
  public static async read(lrxPath: string) {
    if (!fs.existsSync(lrxPath)) {
      return "";
    }

    return new LRXFile(lrxPath).read();
  }

  public static getParser() {
    return source;
  }

  public static async rate(lrxPath: string) {
    let content = await this.read(lrxPath);
    let doc = parse(content);
    let rates = doc.blocks
      .filter((b) => b.body.filter((l) => l.type === "LINE").length > 0)
      .map((b) => b.avgRate);

    return MathEx.avg(rates);
  }
}
