import * as vscode from "vscode";
import { DefinitionProvider } from "../../decorators/definition-provider";
import { parser } from "../../parser";

@DefinitionProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class GoToRefProvider implements vscode.DefinitionProvider {
  private refRegex = new RegExp(/~(\d*)(?:\+(\d+))?/);

  public provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Thenable<vscode.Location> {
    const range = document.getWordRangeAtPosition(position, this.refRegex);

    if (range === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently.
      });
    }

    const word = document.getText(range);
    return new Promise((resolve, reject) => {
      if (word.match(this.refRegex)) {
        let parsedDoc = parser.parse(document.getText());
        let w = document.getText(range);
        let [, n] = w.match(this.refRegex);
        let nn = parseInt(n);
        let foundLine = parsedDoc.report.lines.find((line) => line.n === nn);
        const pos = new vscode.Position(
          foundLine.loc.start.line - 1,
          foundLine.loc.start.column
        );

        resolve(new vscode.Location(document.uri, pos));
      } else {
        reject("Not a Unicode escape.");
      }
    });
  }
}
