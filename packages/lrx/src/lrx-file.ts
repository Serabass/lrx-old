import * as fs from 'fs';
import * as fse from "fs-extra";
import md5File from "md5-file";
import {File} from "./interfaces/file";

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
