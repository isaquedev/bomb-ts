interface IPosition {
  x: number,
  y: number
}

interface ITileConfig {
  tileSize: number;
  tiles: ITile;
}

interface ITileKeys {
  [key: string]: ITileItem
}

interface ITile extends ITileKeys {
  ground: ITileItem;
  player: ITileItem;
  wall: ITileItem;
  box: ITileItem;
  bomb: ITileItem;
  explosion: ITileItem;
}

interface ITileItem {
  id: number;
  name: string;
  color: string;
  size: number;
  physics: boolean;
  explosivable: boolean;
}