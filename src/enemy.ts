interface IEnemyManager {
  enemies: Array<IEnemy>;
  start: IEnemyStart;
  update: Function;
}

interface IEnemy {
  object: ILiveObject;
  start: IEnemyFunction;
  update: IEnemyFunction;
  move: IEnemyFunction;
  damage: IEnemyFunction;
}

interface IEnemyFunction { (enemy: ILiveObject): void }

interface IEnemyStart { (pos: IPosition): void }

const enemyManager: IEnemyManager = {
  enemies: [],
  start: (pos: IPosition) => {
    
  },
  update: () => {

  },
}

export default enemyManager