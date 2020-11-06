import game from "../game/game.js"
import tiles from "../game/tiles.js"
import { arrayContains } from "../utils/utils.js"
import EnemySimpleMove from './enemy_simple_move.js';
import EnemyNestedMove from "./enemy_nested_move.js";

const enemyManager: IEnemyManager = {
  enemies: [],
  skipCount: 0,
  skipMax: 2,
  start: () => {
    enemyManager.enemies = []

    game.forCoordinates(pos => {
      let coordinate = game.getCoordinate(pos)
      let enemy: IBaseEnemy
      if (arrayContains<number>(coordinate, tiles.enemySimpleMove.id)) {
        enemy = new EnemySimpleMove()
      }
      if (arrayContains<number>(coordinate, tiles.enemyNestedMove.id)) {
        enemy = new EnemyNestedMove()
      }
      if (enemy) {
        enemy.start(pos)
        enemyManager.enemies.push(enemy)
      }
    })
  },
  getEnemy: (pos: IPosition, tileId: number) => {
    return enemyManager.enemies.find(enemy => enemy.id === tileId && enemy.position.x === pos.x && enemy.position.y === pos.y)
  },
  update: () => {
    if (enemyManager.enemies.length === 0) {
      alert('you win')
      game.reset()
      return;
    }

    enemyManager.skipCount++
    enemyManager.enemies.forEach(enemy => enemy.update(enemyManager.skipCount !== enemyManager.skipMax))
    if (enemyManager.skipCount == enemyManager.skipMax) enemyManager.skipCount = 0
  },
  damage: (enemy: IBaseEnemy) => {
    enemy.damage()
    if (enemy.hp === 0) {
      let index = enemyManager.enemies.indexOf(enemy)
      enemyManager.enemies.splice(index, 1)
    }
  }
}

export default enemyManager