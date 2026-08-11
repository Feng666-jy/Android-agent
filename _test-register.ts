import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./_js-to-ts-loader.ts", pathToFileURL("./"));