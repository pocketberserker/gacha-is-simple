import * as core from "@cowlick/core";
import * as novel from "@cowlick/engine";
import {Tag} from "./constants";

export const createLink = (controller: novel.SceneController, link: core.Link) => {
  // FIXME: LabelButtonParamatersが公開されたら型を明示する
  const params = {
    scene: controller.current.body,
    width: link.width,
    height: link.height,
    backgroundImage: link.backgroundImage,
    padding: link.padding,
    backgroundEffector: link.backgroundEffector,
    text: link.text,
    config: controller.config,
    gameState: controller.current.gameState
  } as any;
  if (link.fontSize) {
    params.fontSize = link.fontSize;
  }
  const button = new novel.LabelButton(params);
  button.move(link.layer.x, link.layer.y);
  for (const script of link.scripts) {
    button.onClick.add(() => {
      novel.Engine.scriptManager.call(controller, script);
    });
  }
  return button;
};

export const black = (opacity: number): core.Image => ({
  tag: core.Tag.image,
  assetId: "black",
  layer: {
    name: "black",
    opacity
  }
});

export const finish: core.Link = {
  tag: core.Tag.link,
  text: "おわる",
  layer: {
    name: "button",
    x: g.game.width - 150,
    y: 380
  },
  width: 140,
  height: 32,
  fontSize: 32,
  backgroundImage: "red",
  padding: 4,
  backgroundEffector: {
    borderWidth: 4
  },
  scripts: [
    {
      tag: core.Tag.extension,
      data: {
        tag: Tag.nextScene,
        label: "result"
      }
    }
  ]
};
