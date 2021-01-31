import * as vscode from "vscode";
import { FoldingRangeProvider } from "../../decorators/fonding-range-provider";
import { parser } from "../../parser";

@FoldingRangeProvider({
  selector: { language: "lrx", scheme: "file" },
})
export class Fold implements vscode.FoldingRangeProvider {
  provideFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.FoldingRange[]> {
    let { blocks } = parser.parse(document.getText());

    var completedRegions: vscode.FoldingRange[] = blocks.map(
      (block: any) =>
        new vscode.FoldingRange(
          block.loc.start.line - 1,
          block.loc.end.line - 3,
          vscode.FoldingRangeKind.Region
        )
    );

    return completedRegions;
  }
}
