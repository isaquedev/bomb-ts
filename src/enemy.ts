import game from "./game.js"
import tilesConfig from "./tiles_config.js"
import { arrayContains } from "./utils.js"
import EnemySimpleMove from './enemy_simple_move.js';

interface IEnemyManager {
  enemies: Array<EnemySimpleMove>;
  skip: boolean;
  start: Function;
  update: Function;
  damage: IEnemyManagerDamage
}

interface IEnemyManagerDamage { (pos: IPosition): void }

const enemyManager: IEnemyManager = {
  enemies: [],
  skip: false,
  start: () => {
    enemyManager.enemies = []

    game.forCoordinates(pos => {
      let coordinate = game.getCoordinate(pos)
      if (arrayContains<number>(coordinate, tilesConfig.tiles.enemySimpleMove.id)) {
        let enemy = new EnemySimpleMove()
        enemy.start(pos)
        enemyManager.enemies.push(enemy)
      }
    })
  },
  update: () => {
    if (enemyManager.enemies.length === 0) {
      alert('you win')
      game.reset()
      return;
    }

    if (enemyManager.skip) {
      enemyManager.skip = false;
      return;
    }
    enemyManager.enemies.forEach(enemy => enemy.update())
    enemyManager.skip = true;
  },
  damage: (pos: IPosition) => {
    let remove:Array<EnemySimpleMove> = []
    enemyManager.enemies.forEach(enemy => {
      if (enemy.position.x === pos.x && enemy.position.y === pos.y) {
        enemy.damage()
        remove.push(enemy)
      }
    })
    enemyManager.enemies = enemyManager.enemies.filter(enemy => !arrayContains<EnemySimpleMove>(remove, enemy))
  }
}

export default enemyManager