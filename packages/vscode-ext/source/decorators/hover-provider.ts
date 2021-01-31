import { extensionMeta } from "../ext/meta";

export function HoverProvider(options: any): ClassDecorator {
  return (target: any) => {
    extensionMeta.push({
      type: "HoverProvider",
      target,
      options,
    });
  };
}
