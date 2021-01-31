import * as vscode from "vscode";
import "./providers/chord-hover";
import "./providers/header-hover";
import "./providers/line-hover";
import "./providers/Fold";
import "./providers/ref-hover";
import "./providers/lyr-highlight";
import "./providers/GotoRefProvider";
import "./providers/GotoRefProvider";
import { GPEditorProvider } from "./gp";
import { LineColor, LineColorCov } from "./providers/line-color";
import { AlbumMetaProvider } from "./album-meta";
import { extensionMeta } from "./meta";

// Provide the hovers.
export function activate(context: vscode.ExtensionContext): void {
  const SELECTOR = { language: "lrx", scheme: "file" };

  const languages = vscode.languages;
  extensionMeta.forEach((item) => {
    switch (item.type) {
      case "HoverProvider":
        context.subscriptions.push(
          languages.registerHoverProvider(
            item.options.selector,
            new item.target()
          )
        );
        break;
      case "DocumentHighlightProvider":
        context.subscriptions.push(
          languages.registerDocumentHighlightProvider(
            item.options.selector,
            new item.target()
          )
        );
        break;
      case "FoldingRangeProvider":
        context.subscriptions.push(
          languages.registerFoldingRangeProvider(
            item.options.selector,
            new item.target()
          )
        );
        break;
      case "DefinitionProvider":
        context.subscriptions.push(
          languages.registerDefinitionProvider(
            item.options.selector,
            new item.target()
          )
        );
        break;
      case "DocumentSemanticTokensProvider":
        context.subscriptions.push(
          languages.registerDocumentSemanticTokensProvider(
            item.options.selector,
            new item.target(),
            item.options.legend
          )
        );
        break;
    }
  });
  // context.subscriptions.push(
  //   languages.registerCodeLensProvider(SELECTOR, new HeaderLens())
  // );
  // context.subscriptions.push(
  //   languages.registerHoverProvider(SELECTOR, new WordHover())
  // );
  context.subscriptions.push(
    languages.registerColorProvider(SELECTOR, new LineColor())
  );

  context.subscriptions.push(GPEditorProvider.register(context));
  context.subscriptions.push(AlbumMetaProvider.register(context));
  // context.subscriptions.push(MetaEditorProvider.register(context));

  new LineColorCov().init();
}
