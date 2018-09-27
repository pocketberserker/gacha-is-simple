export interface Item {
  id: string;
  name: string;
  assetId: string;
  rank: number;
  point: number;
}

const deserialize = (text: string): Item[] => {
  return JSON.parse(text);
};
export const items = deserialize((g.game.assets["items"] as g.TextAsset).data);
