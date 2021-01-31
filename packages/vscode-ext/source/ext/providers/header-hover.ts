import * as vscode from "vscode";
import { HoverProvider } from "../../decorators/hover-provider";
import { HasParser } from "../HasParser";

@HoverProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class HeaderHover extends HasParser implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Thenable<vscode.Hover> {
    let parsedDoc = this.parse(document);
    let result = parsedDoc.findBlockHeader(position);
    if (result === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently.
      });
    }
    let { range, block } = parsedDoc.findBlockHeader(position);
    if (range === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently.
      });
    }
    const word = document.getText(range);
    return new Promise((resolve, reject) => {
      const markdown = makeHeaderMarkdown(word, block);

      resolve(new vscode.Hover(markdown, range));
    });
  }
  public dispose() {}
}

export function makeHeaderMarkdown(
  word: string,
  block: any
): vscode.MarkdownString {
  const avgRate = block.avgRate.toFixed(2);
  const linesCount = block.body.filter((l: any) => l.type === "LINE").length;
  const markdown = `*${word}* {${linesCount} lines, rate: ${avgRate}}`;
  return new vscode.MarkdownString(markdown);
}
