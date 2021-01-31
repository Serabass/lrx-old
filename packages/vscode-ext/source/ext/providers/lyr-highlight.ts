import * as vscode from "vscode";
import { DocumentSemanticTokensProvider } from "../../decorators/document-semantic-tokens-provider";
import { HasParser } from "../HasParser";

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

export const legend = (() => {
  const tokenTypesLegend = [
    "comment",
    "string",
    "keyword",
    "number",
    "regexp",
    "operator",
    "namespace",
    "type",
    "struct",
    "class",
    "interface",
    "enum",
    "typeParameter",
    "function",
    "member",
    "macro",
    "variable",
    "parameter",
    "property",
    "label",
  ];
  tokenTypesLegend.forEach((tokenType, index) =>
    tokenTypes.set(tokenType, index)
  );

  // these need editor config to show
  const tokenModifiersLegend = [
    "declaration",
    "documentation",
    "readonly",
    "static",
    "abstract",
    "deprecated",
    "modification",
    "async",
  ];
  tokenModifiersLegend.forEach((tokenModifier, index) =>
    tokenModifiers.set(tokenModifier, index)
  );

  return new vscode.SemanticTokensLegend(
    tokenTypesLegend,
    tokenModifiersLegend
  );
})();

interface IParsedToken {
  line: number;
  startCharacter: number;
  length: number;
  tokenType?: string;
  tokenModifiers?: string[];
}

@DocumentSemanticTokensProvider({
  selector: { language: "lrx", scheme: "file" },
  legend,
})
export class LyrHighlight
  extends HasParser
  implements vscode.DocumentSemanticTokensProvider {
  async provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.SemanticTokens> {
    const allTokens = this._parseText(document.getText());
    const builder = new vscode.SemanticTokensBuilder();
    allTokens.forEach((token) => {
      const type = this._encodeTokenType(token.tokenType as any);
      const modifiers = this._encodeTokenModifiers(token.tokenModifiers as any);
      builder.push(
        token.line,
        token.startCharacter,
        token.length,
        type,
        modifiers
      );
    });
    return builder.build();
  }

  private _encodeTokenType(tokenType: string): number {
    if (tokenTypes.has(tokenType)) {
      return tokenTypes.get(tokenType)!;
    } else if (tokenType === "notInLegend") {
      return tokenTypes.size + 2;
    }
    return 0;
  }

  private _encodeTokenModifiers(strTokenModifiers: string[]): number {
    let result = 0;
    for (let i = 0; i < strTokenModifiers.length; i++) {
      const tokenModifier = strTokenModifiers[i];
      if (tokenModifiers.has(tokenModifier)) {
        result = result | (1 << tokenModifiers.get(tokenModifier)!);
      } else if (tokenModifier === "notInLegend") {
        result = result | (1 << (tokenModifiers.size + 2));
      }
    }
    return result;
  }

  private _parseText(text: string): IParsedToken[] {
    return this.parseText(text).findHighlight();
  }

  private _parseTextToken(
    text: string
  ): { tokenType: string; tokenModifiers: string[] } {
    let parts = text.split(".");
    return {
      tokenType: parts[0],
      tokenModifiers: parts.slice(1),
    };
  }
}
