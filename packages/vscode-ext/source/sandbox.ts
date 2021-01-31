import { parser } from "./parser";
import * as fs from "fs";
let file = "D:\\_dev\\common\\gp\\totl\\turn\\turn.lyr";
let c = fs.readFileSync(file).toString("utf-8");

try {
  const block = parser.parse(c).blocks[1];
  let lines = block.body.filter((l) => l.type === "LINE").map((l) => l);
  console.log(block);
} catch (e) {
  console.error("er");
  console.error(e);
}
