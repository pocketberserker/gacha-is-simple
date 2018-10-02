import * as core from "@cowlick/core";
import {Engine} from "@cowlick/engine";
import {Tag} from "./constants";

export class AssetCollector extends core.DefaultAssetCollector {
  collectScript(script: core.Script): string[] {
    switch (script.tag as string) {
      case Tag.ranking:
        return ["yellow", "red"];
      case Tag.gachaDetail:
        return ["yellow", "red"];
      case core.Tag.extension:
        return this.collectScript((script as core.Extension).data);
      default:
        return super.collectScript(script);
    }
  }
}
