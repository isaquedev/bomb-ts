//all files
interface IPosition {
  x: number,
  y: number
}

//game.ts
interface IGame {
  context: CanvasRenderingContext2D;
  start: Function;
  update: Function;
  scenario: Array<Array<Array<number>>>;
}

//tiles_config.ts
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

//bombs.ts
interface IBombManager {
  bombs: Array<IBomb>;
  explode: IBombManagerExplode;
  clean: IBombManagerClean;
}

interface IBombManagerExplode {
  (id: number): void
}

interface IBombManagerClean {
  (explosion: Array<IPosition>): void
}

interface IBomb {
  id: number;
  x: number;
  y: number;
  power: number;
  timeOut: number;
}

//live object
interface ILiveObject {
  params: ILiveObjectParams;
  methods: ILiveObjectMethods;
}

interface ILiveObjectParams {
  hp: number;
  dead: boolean;
  isInvulnerable: boolean;
  position: IPosition;
}

interface ILiveObjectMethods {
  start: Function;
  update: Function;
  damage: Function;
  move: Function;
}

//bombers files
interface IBomber {
  bombPower: number;
  bombCount: number
}

//player.ts
interface IPlayer {
  object: ILiveObject;
  bomber: IBomber;
  leaveBomb: Function;
  actions: IPlayerActions;
}

interface IPlayerActions {
  keyCodes: Array<IPlayerActionKey>;
  status: IPlayerActionStatus;
}

interface IPlayerActionKey {
  key: number;
  name: string
}

interface IPlayerActionStatusKey {
  [key: string]: boolean
}

interface IPlayerActionStatus extends IPlayerActionStatusKey {
  moveLeft: boolean;
  moveRight: boolean;
  moveTop: boolean;
  moveBot: boolean;
  leaveBomb: boolean;
}

//utils.ts
interface IGetTileById { (tileId: number): ITileItem }

interface IIsTileAvailable { (layer: Array<number>): boolean }

interface IIsTileExplosivable { (layer: Array<number>): boolean }

interface IIsTileDestructive { (layer: Array<number>): boolean }

interface IGetLayer { (pos: IPosition): Array<number> }

interface IArrayContains { <T>(array: Array<T>, value: T): boolean }

//times.ts
interface ITimes {
  playerInvulnerability: number,
  bombDelayToExplode: number,
  explosionDuration: number
}