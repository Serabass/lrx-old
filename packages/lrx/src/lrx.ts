import * as fs from "fs";
import * as fse from "fs-extra";
import { hash } from "@serabass/hash";
import { MathEx } from "@serabass/math";
import { cache, Cacheable, CacheDriver, CacheKey } from "@serabass/cache";
import { File } from "@mwf/common";
import { source, parse } from "./parser";

export class Lrx {
  public static cache = cache(["LRX"]);
  public static async read(lrxPath: string) {
    if (!fs.existsSync(lrxPath)) {
      return "";
    }

    return new LRXFile(lrxPath).read();
  }

  public static getParser() {
    return this.cache.remember(["PegParser", "parserHash"], 10, () => source);
  }

  public static async rate(lrxPath: string) {
    let hashValue = await hash().file(lrxPath);
    return this.cache.remember(["Rate", hashValue], 10, async () => {
      let content = await this.read(lrxPath);
      let doc = parse(content);
      let rates = doc.blocks
        .filter((b) => b.body.filter((l) => l.type === "LINE").length > 0)
        .map((b) => b.avgRate);

      return MathEx.avg(rates);
    });
  }
}

export class LRXFile implements File, Cacheable {
  public readonly md5: string;
  public cache: CacheDriver;

  public constructor(public filename: string) {
    this.md5 = hash().fileSync(filename);
    this.cache = cache(["LRXFile", this.filename, this.md5]);
  }

  public async getCacheKey(): Promise<CacheKey> {
    return ["LRXFile", this.filename, this.md5];
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
    let hashValue = hash().fileSync(this.filename);
    return this.cache.remember(["Contents", hashValue], 10, () => {
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
    });
  }
}
