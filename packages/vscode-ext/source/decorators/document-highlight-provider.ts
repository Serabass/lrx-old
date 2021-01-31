import { extensionMeta } from "../ext/meta";

export function DocumentHighlightProvider(options: any): ClassDecorator {
  return (target: any) => {
    extensionMeta.push({
      type: "DocumentHighlightProvider",
      target,
      options,
    });
  };
}
