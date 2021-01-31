import * as vscode from "vscode";
import { HasParser } from "../HasParser";

class TransformerCodeLens extends vscode.CodeLens {
  readonly token: string;

  constructor(range: vscode.Range, token: string) {
    super(range);

    this.token = token;
  }
}

export class HeaderLens extends HasParser implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void> | undefined;
  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    let codeLenses: vscode.CodeLens[] = [];
    let range = new vscode.Range(
      new vscode.Position(1, 1),
      new vscode.Position(1, 5)
    );
    codeLenses.push(new TransformerCodeLens(range, "token"));

    return codeLenses;
  }
}
