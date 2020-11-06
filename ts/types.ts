//all files
interface IPosition {
  x: number,
  y: number
}

interface IPositionMove {
  absolutePostion: IPosition;
  coordinatePosition: IPosition;
  physicalValid: boolean;
}

//game.ts
interface IGame {
  context: CanvasRenderingContext2D;
  updaterId: number;
  reseting: boolean;
  getCoordinate: IGameCoordinate;
  forCoordinates: IGameForCoordinates;
  coordinateToAbsolute: IGamePosCoordinate;
  start: Function;
  update: Function;
  reset: Function;
  drawTile: IGameTile;
  drawSprite: IGameSprite;
  scenario: Array<Array<Array<number>>>;
}

interface IGameTile { (pos: IPosition, tile: ITileItem): void }

interface IGameSprite { (pos: IPosition, sprite: string): void }

interface IGameCoordinate { (pos: IPosition): Array<number> }

interface IGamePosCoordinate { (pos: IPosition): IPosition }

interface IGameForCoordinates { (doOnCoordinate: IPositionFunction): void }

interface IPositionFunction { (pos: IPosition): void }

//physics.ts
interface IPhysicsMove { (coordinatePosition: IPosition, direction: IPosition, nextAbsolutePosition: IPosition): IPositionMove }

//tiles_config.ts
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
  sprite: string;
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
  position: IPosition;
  absolutePosition: IPosition;
  start: Function;
  update: Function;
  damage: Function;
  bomber: IBomber;
  reset: Function;
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
  absolutePosition: IPosition;
  color: string
  start: Function;
  update: Function;
  damage: Function;
}

interface IEnemyManager {
  enemies: Array<IBaseEnemy>;
  getEnemy: IEnemyManagerGetEnemy;
  skipCount: number;
  skipMax: number;
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