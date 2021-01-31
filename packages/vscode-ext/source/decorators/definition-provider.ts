import { extensionMeta } from "../ext/meta";

export function DefinitionProvider(options: any): ClassDecorator {
  return (target: any) => {
    extensionMeta.push({
      type: "DefinitionProvider",
      target,
      options,
    });
  };
}
