import * as vscode from "vscode";
import { HoverProvider } from "../../decorators/hover-provider";
import { HasParser } from "../HasParser";

@HoverProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class RefHover extends HasParser implements vscode.HoverProvider {
  private refRegex = new RegExp(/~([\d\.]*)(?:\+(\d+))?/);

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Thenable<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, this.refRegex);

    if (range === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently.
      });
    }
    const word = document.getText(range);
    return new Promise((resolve, reject) => {
      if (word.match(this.refRegex)) {
        let parsedDoc = this.parse(document).parsedDocument;
        let markdown = this.makeRefMarkdown(word, parsedDoc);

        resolve(new vscode.Hover(markdown, range));
      } else {
        reject("Not a Unicode escape.");
      }
    });
  }

  public dispose() {}

  private makeRefMarkdown(word: string, parsedDoc: any): vscode.MarkdownString {
    let [, n, rate] = word.match(this.refRegex);
    let stars = "⭐".repeat(parseInt(rate, 10));
    let found: string[] = parsedDoc.report.lines
      .filter((line) => {
        return line.n === n;
      })
      .map(({ text }) => {
        let lines = text.split(/\s*,\s*/);

        return lines.map((line: any) => `* ${line}`).join("\n");
      });
    return new vscode.MarkdownString(
      `### ~${n}\n${stars}\n\n --- \n\n${found.join("\n\n")}`
    );
  }
}
