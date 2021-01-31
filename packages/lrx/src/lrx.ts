import * as fs from "fs";
import * as fse from "fs-extra";
import md5File from "md5-file";
import {File} from "./interfaces/file";
import {source, parse} from "./parser";
import {MathEx} from './math-ex';

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

export class LRXFile implements File {
  public readonly md5: string;

  public constructor(public filename: string) {
    this.md5 = md5File.sync(filename);
  }

  public get exists() {
    return fse.existsSync(this.filename);
  }

  public get mtime() {
    return this.stats.mtimeMs;
  }

  public get stats(): fse.Stats {
    return fse.statSync(this.filename);
  }

  public read() {
    return new Promise<string>((resolve, reject) => {
      if (!fs.existsSync(this.filename)) {
        return "";
      }

      return fs.readFile(this.filename, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.toString("utf-8"));
      });
    });
  }
}
