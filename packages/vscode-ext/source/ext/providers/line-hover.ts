import * as vscode from "vscode";
import { DocumentHighlightProvider } from "../../decorators/document-highlight-provider";
import { HoverProvider } from "../../decorators/hover-provider";
import { HasParser } from "../HasParser";

@HoverProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class LineHover extends HasParser implements vscode.HoverProvider {
  private getRange(document: vscode.TextDocument, position: vscode.Position) {
    function fn(parsedDoc): any {
      let range: vscode.Range | undefined;
      let resultBlock;
      let rgx = /(.+?)~(\d*)(\+(\d+))?/g;
      let match: RegExpExecArray | null = null;

      for (let block of parsedDoc.blocks) {
        for (let line of block.body) {
          if (line.type !== "LINE") {
            continue;
          }

          match = rgx.exec(line.content);

          while (match !== null) {
            if (
              line.loc.start.line - 1 === position.line &&
              line.loc.start.column - 1 + match.index <= position.character &&
              line.loc.start.column + match.index + match[1].length >=
                position.character
            ) {
              const posStart = new vscode.Position(
                line.loc.start.line - 1,
                line.loc.start.column - 1 + match.index
              );
              const posEnd = new vscode.Position(
                line.loc.start.line - 1,
                line.loc.start.column - 1 + match.index + match[1].length
              );

              range = new vscode.Range(posStart, posEnd);
              resultBlock = block;
              return {
                range,
                resultBlock,
                match,
              };
            }
            match = rgx.exec(line.content);
          }
        }
      }
    }

    try {
      let parsedDoc = this.parse(document);

      return fn(parsedDoc);
    } catch (e) {
      debugger;
    }
  }

  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    return; // TMP Disabled
    const result = this.getRange(document, position);

    if (result === undefined) {
      return;
    }

    let { range, block, match }: any = result;
    if (range === undefined) {
      return;
    }

    let markdown = "undef";

    if (match !== null) {
      markdown = match[1];
    }

    return new vscode.Hover(markdown, range);
  }
  public dispose() {}
}

@DocumentHighlightProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class LineSelection
  extends HasParser
  implements vscode.DocumentHighlightProvider {
  private getRange(parsedDoc, position: vscode.Position) {
    function fn(parsedDoc): any {
      let range: vscode.Range | undefined;

      for (let block of parsedDoc.blocks) {
        for (let line of block.body) {
          if (line.type !== "LINE") {
            continue;
          }

          for (let content of line.content) {
            if (
              content.loc.start.line - 1 === position.line &&
              content.loc.start.column - 1 <= position.character &&
              content.loc.end.column - 1 >= position.character
            ) {
              const posStart = new vscode.Position(
                line.loc.start.line - 1,
                line.loc.start.column - 1
              );
              const posEnd = new vscode.Position(
                line.loc.start.line - 1,
                line.loc.start.column - 1
              );

              range = new vscode.Range(posStart, posEnd);
              return {
                range,
                block,
                content,
              };
            }
          }
        }
      }
    }

    try {
      let result: vscode.DocumentHighlight[] = [];
      let res = fn(parsedDoc);
      if (!res) {
        return result;
      }

      let n = res.content.bm.n;

      if (!n) {
        return result;
      }

      for (let block of parsedDoc.blocks) {
        for (let line of block.body) {
          if (line.type !== "LINE") {
            continue;
          }

          for (let content of line.content) {
            if (content.bm?.n === n) {
              const posStart = new vscode.Position(
                content.loc.start.line - 1,
                content.loc.start.column - 1
              );
              const posEnd = new vscode.Position(
                content.loc.end.line - 1,
                content.loc.end.column - 1
              );

              let range = new vscode.Range(posStart, posEnd);
              result.push(new vscode.DocumentHighlight(range));
            }
          }
        }
      }

      return result;
    } catch (e) {
      /// debugger;
    }
  }

  public dispose() {}

  provideDocumentHighlights(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DocumentHighlight[]> {
    let parsedDoc = this.parse(document).parsedDocument;
    const result = this.getRange(parsedDoc, position);

    if (result === undefined) {
      return;
    }

    if (result.length === 0) {
      return;
    }

    return result;
  }
}
