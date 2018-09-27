import {Box} from "./Box";
import {Item} from "./Item";

export interface RawLot {
  id: string;
  boxes: string[];
  name: string;
  description: string;
  price: number;
}

export interface LotParameterObject {
  id: string;
  boxes: Box[];
  name: string;
  description: string;
  price: number;
}

export class Lot {
  private _id: string;
  private boxes: Box[];
  private _name: string;
  private _description: string;
  private _price: number;

  constructor(param: LotParameterObject) {
    this._id = param.id;
    this.boxes = param.boxes;
    this._name = param.name;
    this._description = param.description;
    this._price = param.price;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  draw(): Item[] {
    const result: Item[] = [];
    for (const box of this.boxes) {
      result.push(...box.draw());
    }
    return result;
  }
}
