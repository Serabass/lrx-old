import * as vscode from "vscode";

interface SongMeta {
  [k: string]: any;
}

class MetaDocument implements vscode.CustomDocument {
  public meta: SongMeta;

  constructor(readonly uri: vscode.Uri) {}

  dispose() {}
}

export class MetaEditorProvider
  implements vscode.CustomReadonlyEditorProvider<MetaDocument> {
  async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return new MetaDocument(uri);
  }

  resolveCustomEditor(
    document: MetaDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewPanel.webview.html = `
    <h1>META</h1>`;
  }
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MetaEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      MetaEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "album-meta.yml";

  public constructor(public context: vscode.ExtensionContext) {}
}
