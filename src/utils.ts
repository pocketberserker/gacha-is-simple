import * as core from "@cowlick/core";
import {Engine, SceneController} from "@cowlick/engine";
import {LabelButtonParameters, LabelButton} from "./LabelButton";
import {Tag} from "./constants";

export const createLink = (controller: SceneController, link: core.Link) => {
  const params: LabelButtonParameters = {
    scene: controller.current,
    width: link.width,
    height: link.height,
    backgroundImage: link.backgroundImage,
    padding: link.padding,
    backgroundEffector: link.backgroundEffector,
    text: link.text,
    config: controller.config,
    gameState: controller.current.gameState
  };
  if (link.fontSize) {
    params.fontSize = link.fontSize;
  }
  const button = new LabelButton(params);
  button.move(link.layer.x, link.layer.y);
  for (const script of link.scripts) {
    button.onClick.add(() => {
      Engine.scriptManager.call(controller, script);
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
    x: g.game.width - 140,
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
