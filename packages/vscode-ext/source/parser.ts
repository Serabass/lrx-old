import * as path from "path";
import * as fs from "fs";
import * as pegjs from "pegjs";

let source = fs
  .readFileSync(path.join(__dirname, "parser.pegjs"))
  .toString("utf-8");

export let parser = pegjs.generate(source);
