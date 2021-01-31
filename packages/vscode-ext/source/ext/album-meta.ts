import * as vscode from "vscode";

interface SongMeta {
  [k: string]: any;
}

class AlbumMetaDocument implements vscode.CustomDocument {
  constructor(readonly uri: vscode.Uri) {}

  public async init() {
    return this;
  }

  dispose() {}
}

export class AlbumMetaProvider
  implements vscode.CustomReadonlyEditorProvider<AlbumMetaDocument> {
  openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return new AlbumMetaDocument(uri).init();
  }

  resolveCustomEditor(
    document: AlbumMetaDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewPanel.webview.html = `
    <pre>123</pre>`;
  }
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new AlbumMetaProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      AlbumMetaProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "album.meta.yml";

  public constructor(public context: vscode.ExtensionContext) {}
}
