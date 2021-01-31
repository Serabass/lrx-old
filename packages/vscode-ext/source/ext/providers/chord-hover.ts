import * as vscode from "vscode";
import { HoverProvider } from "../../decorators/hover-provider";
import { positions } from "./chord-positions";
import { HasParser } from "../HasParser";

@HoverProvider({
  selector: { language: "lyr", scheme: "file" },
})
export class ChordHoverProvider
  extends HasParser
  implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    let parsedDoc = this.parse(document);
    let range = parsedDoc.findChord(document, position);
    if (range === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently.
      });
    }
    const word = document.getText(range);
    return new Promise((resolve, reject) => {
      const markdown = makeChordMarkdown(word);

      resolve(new vscode.Hover(markdown, range));
    });
  }
  public dispose() {}
}

export function makeChordMarkdown(word: string): vscode.MarkdownString {
  let ch = positions[word];
  const markdown = `${word}: *${ch.join("; ")}*`;
  return new vscode.MarkdownString(markdown);
}
