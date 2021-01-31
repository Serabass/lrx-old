import { extensionMeta } from "../ext/meta";

export function FoldingRangeProvider(options: any): ClassDecorator {
  return (target: any) => {
    extensionMeta.push({
      type: "FoldingRangeProvider",
      target,
      options,
    });
  };
}
