import game from "./game.js"
import tilesConfig from "./tiles_config.js"
import { arrayContains } from "./utils.js"
import EnemySimpleMove from './enemy_simple_move.js';

const enemyManager: IEnemyManager = {
  enemies: [],
  skip: false,
  start: () => {
    enemyManager.enemies = []

    game.forCoordinates(pos => {
      let coordinate = game.getCoordinate(pos)
      let enemy: IBaseEnemy
      if (arrayContains<number>(coordinate, tilesConfig.tiles.enemySimpleMove.id)) {
        enemy = new EnemySimpleMove()
      }
      if (arrayContains<number>(coordinate, tilesConfig.tiles.enemySimpleMove.id)) {
        
      }
      if (enemy) {
        enemy.start(pos)
        enemyManager.enemies.push(enemy)
      }
    })
  },
  getEnemy: (pos: IPosition) => {
    return enemyManager.enemies.find(enemy => enemy.position.x === pos.x && enemy.position.y === pos.y)
  },
  update: () => {
    if (enemyManager.enemies.length === 0) {
      alert('you win')
      game.reset()
      return;
    }

    enemyManager.skip = !enemyManager.skip;
    enemyManager.enemies.forEach(enemy => enemy.update(enemyManager.skip))
  },
  damage: (pos: IPosition) => {
    let remove:Array<IBaseEnemy> = []
    enemyManager.enemies.forEach(enemy => {
      if (enemy.position.x === pos.x && enemy.position.y === pos.y) {
        enemy.damage()
        if (enemy.hp == 0) {
          remove.push(enemy)
        }
      }
    })
    enemyManager.enemies = enemyManager.enemies.filter(enemy => !arrayContains<IBaseEnemy>(remove, enemy))
  }
}

export default enemyManager