//all files
interface IPosition {
  x: number,
  y: number
}

//game.ts
interface IGame {
  context: CanvasRenderingContext2D;
  updaterId: number;
  reseting: boolean;
  getCoordinate: IGameCoordinate;
  forCoordinates: IGameForCoordinates;
  start: Function;
  update: Function;
  reset: Function;
  drawTile: IGameTile;
  scenario: Array<Array<Array<number>>>;
}

interface IGameTile { (pos: IPosition, tile: ITileItem): void }

interface IGameCoordinate { (pos: IPosition): Array<number> }

interface IGameForCoordinates { (doOnCoordinate: IPositionFunction): void }

interface IPositionFunction { (pos: IPosition): void }

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
  enemySimpleMove: ITileItem;
  enemyNestedMove: ITileItem;
}

interface ITileItem {
  id: number;
  name: string;
  color: string;
  size: number;
  physics: boolean;
  explosivable: boolean;
  isPlayer: boolean;
  isEnemy: boolean;
}

//bombs.ts
interface IBombManager {
  bombs: Array<IBomb>;
  explosion: Array<IPosition>;
  explosionIds: Array<number>;
  reset: Function;
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

//bombers files
interface IBomber {
  bombPower: number;
  bombCount: number
}

//player.ts
interface IPlayer {
  hp: number;
  dead: boolean;
  isInvulnerable: boolean;
  shine: boolean;
  position: IPosition;
  start: Function;
  update: Function;
  damage: Function;
  move: Function;
  bomber: IBomber;
  leaveBomb: Function;
  reset: Function;
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

//enemyManager.ts

interface IBaseEnemy {
  id: number;
  hp: number;
  position: IPosition;
  direction: IPosition;
  isInvulnerable: boolean;
  shine: boolean
  color: string
  start: Function;
  update: Function;
  damage: Function;
}

interface IEnemyManager {
  enemies: Array<IBaseEnemy>;
  getEnemy: IEnemyManagerGetEnemy;
  skip: boolean;
  start: Function;
  update: Function;
  damage: IEnemyManagerDamage
}

interface IEnemyManagerGetEnemy { (pos: IPosition, tileId: number): IBaseEnemy }

interface IEnemyManagerDamage { (enemy: IBaseEnemy): void }

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