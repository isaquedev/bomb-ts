//all files
interface IPosition {
  [key: string]: number,
  x: number,
  y: number
}

interface IPositionMove {
  absolutePostion: IPosition;
  coordinatePosition: IPosition;
  physicalValid: boolean;
}

interface IAnim {
  frame: number;
  image: HTMLImageElement
  images: Array<HTMLImageElement>
  startAnimation: Function;
  stopAnimation: Function;
}

//game.ts
interface IGame {
  tileSize: number;
  start: Function;
  update: Function;
  reset: Function;
  scenario: Array<Array<Array<number>>>
  scenarioBuffer: Array<Array<Array<IAnim>>>
  portalBuffer: HTMLImageElement;
  onDestroyBox: IPositionFunction
}

interface IGameSprite { (pos: IPosition, image: HTMLImageElement): void }

interface IGameAnimation { (pos: IPosition, image: HTMLImageElement): void }

interface IGameCoordinate { (pos: IPosition): Array<number> }

interface IGamePosCoordinate { (pos: IPosition): IPosition }

interface IGameForCoordinates { (doOnCoordinate: IPositionFunction): void }

interface IPositionFunction { (pos: IPosition): void }

//physics.ts
interface IPhysicsMove { 
  (
    coordinatePosition: IPosition,
    direction: IPosition,
    nextAbsolutePosition: IPosition
  ): IPositionMove
}

interface IPhysicsEnemyMove { 
  (
    enemyUuid: string,
    coordinatePosition: IPosition,
    direction: IPosition,
    currentAbsolutePosition: IPosition,
    nextAbsolutePosition: IPosition
  ): IPositionMove
}


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
  portal: ITileItem;
}

interface ITileItem {
  id: number;
  animated: boolean;
  sprite: string;
  frames: number;
  physics: boolean;
  explosivable: boolean;
  isPlayer: boolean;
  isEnemy: boolean;
}

//bombs.ts
interface IBombManager {
  bombs: Array<IBomb>;
  getBombByCoordinate: IBombManagerByCoordinate;
  getExplosionByCoordinate: IBombManagerExplosioByCoorindate
  explosions: Array<IExplosion>;
  explosionIds: Array<number>;
  reset: Function;
  explode: IBombManagerExplode;
  clean: IBombManagerClean;
}

interface IBombManagerByCoordinate { (coordinate: IPosition):IBomb }

interface IBombManagerExplosioByCoorindate { (coordinate: IPosition): IAnim }

interface IBombManagerExplode {
  (id: number): void
}

interface IBombManagerClean {
  (explosions: Array<IExplosion>): void
}

interface IBomb {
  id: number;
  x: number;
  y: number;
  image: HTMLImageElement
  power: number;
  timeOut: number;
}

//explosion.ts
interface IExplosion extends IAnim {
  position: IPosition
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
  uuid: string,
  hp: number;
  position: IPosition;
  absolutePosition: IPosition;
  start: Function;
  update: Function;
  damage: Function;
  destroy: Function;
}

interface IEnemyManager {
  enemies: Array<IBaseEnemy>;
  getEnemy: IEnemyManagerGetEnemy;
  getAllEnemies: IEnemyManagerGetAllEnemy;
  skipCount: number;
  skipMax: number;
  start: Function;
  update: Function;
  damage: IEnemyManagerDamage
}

interface IEnemyManagerGetEnemy { (pos: IPosition, tileId: number): IBaseEnemy }

interface IEnemyManagerGetAllEnemy { (pos: IPosition, tileId: number): Array<IBaseEnemy> }

interface IEnemyManagerDamage { (enemy: IBaseEnemy): void }

//utils.ts
interface IGetTileById { (tileId: number): ITileItem }

interface IIsTileAvailable { (physicsPosition: IPosition, currentPosition: IPosition): boolean }

interface IIsTileEnemyAvailable {
  (
    enemyId: string,
    direction: IPosition,
    absolutePosition: IPosition,
    physicsPosition: IPosition,
    currentPosition: IPosition
  ): boolean
}

interface IIsTile { (layer: Array<number>): boolean }

interface IIndexOfDestructibleTile { (layer: Array<number>): number }

interface IGetLayer { (pos: IPosition): Array<number> }

interface IArrayContains { <T>(array: Array<T>, value: T): boolean }

//times.ts
interface ITimes {
  gameUpdate: number,
  gameUpdateMove: number
  gameUpdateMoveAnim: number,
  gameObjectAnim: number
  invulnerability: number,
  bombDelayToExplode: number,
  explosionDuration: number,
}