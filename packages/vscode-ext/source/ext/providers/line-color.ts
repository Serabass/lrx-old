import * as vscode from "vscode";
import lerp from "@sunify/lerp-color";
import { HasParser } from "../HasParser";

// TODO See https://github.com/nexes/statusbar-error/blob/master/src/DiagnosticLine.ts
// TODO See Coverage gutters instead

let from = "#FC3F4D";
let to = "#389E28";

const color2ColorClassColorCode = (color: vscode.Color) => {
  if (color instanceof vscode.Color) {
    let r = color.red;
    let g = color.green;
    let b = color.blue;
    let a = color.alpha;
    let colorCodeString = [r, g, b].map((v) => Math.ceil(v * 255)).join(",");
    return colorCodeString;
  }
  return "0,0,0,0";
};

export class LineColorCov extends HasParser {
  constructor() {
    super();
  }

  public init() {
    return;
    let a: vscode.DecorationOptions = {
      range: new vscode.Range(5, 1, 7, 1),
      hoverMessage: "svinina",
    };
    let t = vscode.window.createTextEditorDecorationType({
      backgroundColor: "#FF0000",
      color: "rgba(0, 0, 0, 0.2)",
    });
    let activeEditor = vscode.window.activeTextEditor;
    activeEditor?.setDecorations(t, [a]);
    debugger;

    return this;
  }
}

export class LineColor
  extends HasParser
  implements vscode.DocumentColorProvider {
  provideDocumentColors(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.ColorInformation[]> {
    let parsedDoc = this.parse(document);
    return parsedDoc.findLineColors();
  }

  provideColorPresentations(
    color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range },
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.ColorPresentation[]> {
    let r = color.red;
    let g = color.green;
    let b = color.blue;
    let a = color.alpha;
    let document = context.document;
    let range = context.range;
    const col2 = new vscode.Color(r, g, b, a);
    return [
      new vscode.ColorPresentation(`color(${color2ColorClassColorCode(col2)})`),
    ];
  }
}
