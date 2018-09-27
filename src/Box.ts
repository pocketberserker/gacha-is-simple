import {AliasTable, AliasMethod, Random} from "@pocketberserker/akashic-random";
import {Item} from "./Item";

export interface RawBox {
  id: string;
  probabilities: number[];
  items: string[];
  numberOfTrials: number;
}

export class Box {
  private _id: string;
  private items: Map<number, Item[]>;
  private random: Random;
  private table: AliasTable;
  private alias: AliasMethod;
  private trials: number;

  constructor(box: RawBox, items: Item[]) {
    this._id = box.id;
    this.items = new Map<number, Item[]>();
    for (const id of box.items) {
      const item = items.find(s => id === s.id);
      let group = this.items.get(item.rank);
      if (group) {
        group.push(item);
      } else {
        group = [item];
        this.items.set(item.rank, group);
      }
    }
    this.random = new Random(g.game.random);
    this.alias = new AliasMethod(g.game.random);
    this.table = this.alias.generate(box.probabilities);
    this.trials = box.numberOfTrials;
  }

  get id() {
    return this._id;
  }

  draw(): Item[] {
    const result: Item[] = [];
    for (let i = 0; i < this.trials; i++) {
      const items = this.items.get(this.alias.get(this.table));
      result.push(items[this.random.getInt(0, items.length)]);
    }
    return result;
  }
}
