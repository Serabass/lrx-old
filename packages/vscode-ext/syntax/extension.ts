import { writeFileSync } from "fs";
import { lyr } from "../source";

interface tmLang {
  id: string;
  scopeName: string;
  uuid: string;
}

function saveSyntax(name: tmLang) {
  writeFileSync(
    `${__dirname}/${name.id}.tmLanguage.json`, //
    JSON.stringify(name, null, 4)
  );
}

[lyr].map(saveSyntax);
