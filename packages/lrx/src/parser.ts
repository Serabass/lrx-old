import * as path from "path";
import * as fs from "fs";
import * as pegjs from "pegjs";
import md5File from "md5-file";
import { LRXDocument } from "./LRXParsedDocument";

const filename = path.join(__dirname, "parser.pegjs");

export let source = fs.readFileSync(filename).toString("utf-8");
export let parser = pegjs.generate(source);
export let parserHash = md5File.sync(filename);
export let parse = (input: string): LRXDocument =>
  parser.parse(input) as LRXDocument;
