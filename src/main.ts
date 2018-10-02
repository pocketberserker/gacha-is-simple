import {Engine, initialize} from "@cowlick/engine";
import {registerScripts} from "./scripts";
import {AssetCollector} from "./AssetCollector";

module.exports = () => {
  Engine.assetCollector = new AssetCollector();
  const engine = initialize(g.game);

  registerScripts(engine);

  engine.load("title");
};
