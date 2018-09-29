import * as core from "@cowlick/core";
import {Item, items} from "./Item";
import {RawBox, Box} from "./Box";
import {RawLot, Lot} from "./Lot";
import {Tag} from "./constants";
import {finish, black} from "./utils";

const top = "gacha";

export interface Result {
  items: Item[];
  price: number;
  target: core.Jump;
}

interface GachaParameterObject {
  game: g.Game;
  label: string;
  lots: Lot[];
  moveTo: core.Jump;
}

export class Gacha {
  private label: string;
  private _lots: Lot[];
  private _scene: core.Scene;
  private resultFrame: number;

  constructor(param: GachaParameterObject) {
    this.label = param.label;
    this._lots = param.lots;

    const frames = [
      new core.Frame([
        {
          tag: core.Tag.trigger,
          value: core.TriggerValue.Off
        },
        {
          tag: core.Tag.layer,
          name: "message",
          visible: false
        },
        {
          tag: core.Tag.removeLayer,
          name: "result"
        },
        {
          tag: core.Tag.removeLayer,
          name: "button"
        },
        {
          tag: core.Tag.removeLayer,
          name: "black"
        },
        {
          tag: core.Tag.image,
          assetId: "yellow",
          layer: {
            name: "black",
            opacity: 0
          }
        },
        {
          tag: core.Tag.image,
          assetId: "red",
          layer: {
            name: "black",
            opacity: 0
          }
        },
        {
          tag: core.Tag.image,
          assetId: "greeting",
          layer: {name: "background"}
        },
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.gachaDetail
          }
        },
        finish,
        black(1),
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.enterScene
          }
        }
      ])
    ];
    this.resultFrame = frames.length;
    frames.push(
      new core.Frame([
        {
          tag: core.Tag.trigger,
          value: core.TriggerValue.Off
        },
        {
          tag: core.Tag.removeLayer,
          name: "detail"
        },
        {
          tag: core.Tag.removeLayer,
          name: "button"
        },
        {
          tag: core.Tag.removeLayer,
          name: "black"
        },
        {
          tag: core.Tag.image,
          assetId: "greeting",
          layer: {name: "background"}
        },
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.gachaResult
          }
        },
        black(1),
        {
          tag: core.Tag.extension,
          data: {
            tag: Tag.enterScene
          }
        }
      ])
    );

    this._scene = new core.Scene({
      label: param.label,
      frames
    });
  }

  get scene() {
    return this._scene;
  }

  get lots() {
    return this._lots;
  }

  draw(id: string): Result {
    const lot = this.lots.find(l => l.id === id);
    return {
      items: lot.draw(),
      price: lot.price,
      target: {
        tag: core.Tag.jump,
        label: this.label,
        frame: this.resultFrame
      }
    };
  }
}

const load = (assetId: string) => {
  return (g.game.assets[assetId] as g.TextAsset).data;
};

const boxes = (JSON.parse(load("boxes")) as RawBox[]).map(r => new Box(r, items));
const lots = (JSON.parse(load("lots")) as RawLot[]).map(
  l =>
    new Lot({
      ...l,
      boxes: l.boxes.map(id => boxes.find(b => id === b.id))
    })
);
export const gacha = new Gacha({
  game: g.game,
  label: top,
  lots,
  moveTo: {
    tag: core.Tag.jump,
    label: top
  }
});
