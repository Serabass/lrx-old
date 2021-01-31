import { extensionMeta } from "../ext/meta";

export function DocumentSemanticTokensProvider(options: any): ClassDecorator {
  return (target: any) => {
    extensionMeta.push({
      type: "DocumentSemanticTokensProvider",
      target,
      options,
    });
  };
}
