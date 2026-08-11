import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve as pathResolve, dirname } from "node:path";

export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && specifier.endsWith(".js")) {
    if (context.parentURL) {
      const parentPath = fileURLToPath(context.parentURL);
      const resolved = pathResolve(dirname(parentPath), specifier);
      const tsPath = resolved.slice(0, -3) + ".ts";
      if (existsSync(tsPath)) {
        return { url: pathToFileURL(tsPath).href, shortCircuit: true };
      }
    }
  }
  return nextResolve(specifier, context);
}