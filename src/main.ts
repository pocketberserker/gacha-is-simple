import {initialize} from "@cowlick/engine";
import {registerScripts} from "./scripts"

module.exports = () => {
  const engine = initialize(g.game);

  registerScripts(engine);

  engine.load("title");
};
