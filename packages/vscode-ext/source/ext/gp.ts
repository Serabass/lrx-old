import * as vscode from "vscode";
import * as yaml from "yaml";
import { Tab } from "../gp/tab";
import { fse } from "./fse";

interface SongMeta {
  [k: string]: any;
}

class GPDocument implements vscode.CustomDocument {
  public gp: Tab;
  public meta: SongMeta;

  constructor(readonly uri: vscode.Uri) {}

  public async init() {
    this.gp = await Tab.from(this.uri.fsPath).init();
    let ymlPath = this.uri.fsPath.replace(/\.gp$/, ".yml");

    this.meta = yaml.parse((await fse.readFile(ymlPath)).toString("utf-8"));
    return this;
  }

  public get mp3Path() {
    return this.uri.fsPath.replace(/\.gp$/, ".mp3");
  }
  dispose() {}
}

export class GPEditorProvider
  implements vscode.CustomReadonlyEditorProvider<GPDocument> {
  openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return new GPDocument(uri).init();
  }

  private progress(value: number) {
    return `<div style="width: 300px; height: 20px; background: red;">
      <div style="width: ${value}%; height: 100%; background: green;"></div>
    </div>`;
  }

  resolveCustomEditor(
    document: GPDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewPanel.webview.html = `
    <h1>${document.gp.artist} - ${document.gp.title} [xx:xx]</h1>
    <p><a href="#">Open in Guitar Pro</a></p>
    <p>Size: ${document.gp.size.join(", ")}</p>
    <p>Tempo: ${document.gp.tempo.join(", ")}</p>
    
    

    ${(() => {
      if (document.meta.url && document.meta.url.length) {
        return (
          `<ul>` +
          document.meta.url.map((u) => `<li><a href="${u}">${u}</a></li>`) +
          `</ul>`
        );
      }

      return "";
    })()}
    <pre>${JSON.stringify(document.meta, null, 4)}</pre>`;
  }
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new GPEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      GPEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "gpCustoms.gp";

  public constructor(public context: vscode.ExtensionContext) {}
}
