import * as tl from "@akashic-extension/akashic-timeline";
import * as pg from "@pocketberserker/akashic-pagination";
import * as al from "@akashic-extension/akashic-label";
import * as core from "@cowlick/core";
import * as novel from "@cowlick/engine";
import {Item} from "./Item";
import {gacha} from "./GachaImpl";
import {Tag} from "./constants";
import {createLink, finish, black} from "./utils";

interface DrawLot {
  tag: "drawLot";
  id: string;
}

interface NextScene {
  tag: "nextScene",
  label: string;
}

const duration = 700;

const drawLot = (controller: novel.SceneController, data: DrawLot) => {
  const scene = controller.current;
  scene.gameState.variables.current.trials++;
  const result = gacha.draw(data.id);
  scene.gameState.variables.current.gacha = {
    id: data.id,
    price: result.price,
    items: result.items
  };
  scene.transition("black", (layer: g.E) => {
    const timeline = new tl.Timeline(scene);
    timeline.create(layer, {modified: layer.modified, destroyed: layer.destroyed})
      .fadeIn(duration)
      .call(() => {
        controller.jump(result.target);
      });
  });
};

const makeGachaPage = (controller: novel.SceneController) => {
  const scene = controller.current;
  const pagination = new pg.Pagination({
    scene,
    x: 0,
    y: 0,
    width: scene.game.width,
    height: scene.game.height,
    limit: {
      vertical: 1,
      horizontal: 1
    },
    position: pg.Position.Bottom,
    paddingRight: 0
  });
  scene.appendLayer(pagination, {name: "detail"});

  const selected = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.selectedFont
  });
  const font = controller.config.font.list[selected];
  const fontSize = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.fontSize
  });
  const textColor = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.fontColor
  });
  const score = scene.gameState.getStringValue({
    type: core.VariableType.current,
    name: "score"
  });
  const remaining = scene.gameState.variables.system.maxTrials - scene.gameState.variables.current.trials;
  for (const lot of gacha.lots) {
    const e = new g.E({
      scene,
      width: g.game.width,
      height: g.game.height
    });
    const label = new al.Label({
      scene,
      font,
      text: `【${lot.name}】
${lot.description}

消費ポイント: ${lot.price}
所持ポイント: ${score}
あと${remaining}回まわせます`,
      fontSize,
      textColor,
      width: g.game.width,
      x: 0,
      y: 50,
      textAlign: g.TextAlign.Center
    });
    e.append(label);
    const link = createLink(controller, {
      tag: core.Tag.link,
      text: "ガチャをまわす",
      layer: {
        name: "button",
        x: scene.game.width / 2 - 120,
        y: 300
      },
      width: 240,
      height: 32,
      fontSize: 32,
      backgroundImage: "yellow",
      padding: 4,
      backgroundEffector: {
        borderWidth: 4
      },
      scripts: [
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.drawLot,
            id: lot.id
          }
        }
      ]
    });
    e.append(link);

    pagination.content.append(e);
  }

  if (scene.gameState.variables.current.gacha) {
    const index = gacha.lots.findIndex(l => l.id === scene.gameState.variables.current.gacha.id);
    pagination.moveOffset(index);
  }
}

const count = (array: Item[]): { [id: string]: number } => {
  return array.reduce(
    (group: { [id: string]: number }, item) => {
      if (item.id in group) {
        group[item.id]++;
        return group;
      } else {
        return Object.assign(group, {
          [item.id]: 1
        });
      }
    },
    {}
  );
};

const gachaResult = (controller: novel.SceneController) => {
  const scene = controller.current;
  const result = controller.current.gameState.variables.current.gacha;
  const score = controller.current.gameState.variables.current.score;

  const selected = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.selectedFont
  });
  const font = controller.config.font.list[selected];
  const fontSize = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.fontSize
  });
  const textColor = scene.gameState.getValue({
    type: core.VariableType.builtin,
    name: core.BuiltinVariable.fontColor
  });

  const items = count(result.items);
  const itemTexts: string[] = [];
  let points = 0;
  for (const id in items) {
    const item = (result.items as Item[]).find(i => i.id === id);
    const num = items[id];
    itemTexts.push(`${item.name}（${item.point}ポイント） × ${num}`);
    points += item.point * num;
  }
  const finalScore = score - result.price + points;
  scene.gameState.variables.current.score = finalScore;

  const label = new al.Label({
    scene,
    font,
    text: `【ガチャ結果】
${itemTexts.join("\n")}
を入手！

所持ポイント: ${score}
消費ポイント: ${result.price}
入手ポイント: ${points}
合計ポイント: ${finalScore}`,
    fontSize,
    textColor,
    width: g.game.width,
    x: 0,
    y: 50,
    textAlign: g.TextAlign.Center
  });
  scene.appendLayer(label, { name: "result" });

  if (scene.gameState.variables.current.trials < scene.gameState.variables.system.maxTrials) {
    const layer = {
      name: "button",
      x: scene.game.width - 300,
      y: 380
    };
    const link = createLink(controller, {
      tag: core.Tag.link,
      text: "続ける",
      layer,
      width: 140,
      height: 32,
      fontSize: 32,
      backgroundImage: "yellow",
      padding: 4,
      backgroundEffector: {
        borderWidth: 4
      },
      scripts: [
        black(0),
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.nextScene,
            label: "gacha"
          }
        }
      ]
    });
    scene.appendLayer(link, layer);
  }

  novel.Engine.scriptManager.call(controller, finish);
};

const atsumaru = (window as any).RPGAtsumaru;
const boardId = 1;

export const registerScripts = (engine: novel.Engine) => {
  engine.script(Tag.drawLot, drawLot);
  const fadeInScript = novel.defaultScripts.get(core.Tag.fadeIn);
  engine.script(core.Tag.fadeIn, (controller: novel.SceneController, data: any) => {
    data.after = [
      {
        tag: core.Tag.skip
      }
    ];
    fadeInScript(controller, data);
  });
  const fadeOutScript = novel.defaultScripts.get(core.Tag.fadeOut);
  engine.script(core.Tag.fadeOut, (controller: novel.SceneController, data: any) => {
    data.after = [
      {
        tag: core.Tag.skip
      }
    ];
    fadeOutScript(controller, data);
  });
  engine.script(Tag.enterScene, (controller: novel.SceneController) => {
    const scene = controller.current;
    scene.disableWindowClick();
    scene.transition("black", (layer: g.E) => {
      const timeline = new tl.Timeline(scene);
      timeline.create(layer, {modified: layer.modified, destroyed: layer.destroyed}).fadeOut(duration);
    });
  });
  engine.script(Tag.clearData, (controller: novel.SceneController) => {
    controller.current.gameState.variables.current.gacha = {};
    controller.current.gameState.variables.current.score = 1000;
    controller.current.gameState.variables.current.trials = 0;
    controller.current.gameState.variables.system.maxTrials = 10;
  });
  engine.script(Tag.gachaResult, gachaResult);
  engine.script(Tag.gachaDetail, makeGachaPage);
  engine.script(Tag.nextScene, (controller: novel.SceneController, data: NextScene) => {
    const scene = controller.current;
    scene.disableWindowClick();
    scene.transition("black", (layer: g.E) => {
      const timeline = new tl.Timeline(scene);
      timeline.create(layer, {modified: layer.modified, destroyed: layer.destroyed})
        .fadeIn(duration)
        .call(() => {
          controller.jump({
            tag: core.Tag.jump,
            label: data.label
          })
        });
    });
  });
  //engine.script(core.Tag.exception, (controller: novel.SceneController, e: core.GameError) => {
  //  throw e;
  //});

  engine.script("newgame", (controller: novel.SceneController) => {
    const layer = {
      name: "button",
      x: g.game.width / 2 - 100,
      y: 300
    };
    const link = createLink(controller, {
      tag: core.Tag.link,
      width: 200,
      height: 32,
      text: "はじめる",
      fontSize: 32,
        backgroundImage: "yellow",
        padding: 4,
        backgroundEffector: {
          borderWidth: 4
        },
      scripts: [
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.nextScene,
            label: "prologue"
          }
        }
      ],
      layer
    });
    controller.current.appendLayer(link, layer);
  });
  engine.script("record", (controller: novel.SceneController) => {
    if (atsumaru) {
      atsumaru.experimental.scoreboards.setRecord(boardId, controller.current.gameState.variables.current.score);
    }
  });
  engine.script(Tag.ranking, (controller: novel.SceneController) => {
    const layer = {
      name: "button",
      x: g.game.width - 210,
      y: 380
    };
    const link = createLink(controller, {
      tag: core.Tag.link,
      width: 200,
      height: 32,
      text: "ランキング",
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
            tag: Tag.showRanking
          }
        }
      ],
      layer
    });
    controller.current.appendLayer(link, layer);
  });
  engine.script(Tag.showRanking, (controller: novel.SceneController) => {
    if (atsumaru) {
      atsumaru.experimental.scoreboards.display(boardId);
    }
  });
};
