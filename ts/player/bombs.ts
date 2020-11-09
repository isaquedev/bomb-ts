import game from "../game/game.js"
import player from "./player.js"
import tiles from "../game/tiles.js"
import {
  getLayer, isTileExplosivable, isTileDestructive,
  indexOfDestructibleTile, arrayContains, getCoordinate
} from '../utils/utils.js'
import times from '../utils/times.js';
import Explosion from './explosion.js';

const bombManager: IBombManager = {
  bombs: [],
  getBombByCoordinate: (coordinate: IPosition) => {
    return bombManager.bombs.find(bomb => bomb.x === coordinate.x
                                          && bomb.y === coordinate.y)
  },
  getExplosionByCoordinate: (coordinate: IPosition): IAnim => {
    return bombManager.explosions.find(exp => exp.position.x === coordinate.x
                                              && exp.position.y === coordinate.y)
  },
  explosions: [],
  explosionIds: [],
  explode: (id: number) => {
    player.bomber.bombCount += 1

    let bomb = bombManager.bombs.find(bomb => bomb.id == id)
    let bombIndex = bombManager.bombs.indexOf(bomb)
    bombManager.bombs.splice(bombIndex, 1)

    clearTimeout(bomb.timeOut)
    //TODO add bombs in bombs array to explode bomb on explosion colid with them
    let explosions: Array<IExplosion> = [new Explosion({x: bomb.x, y: bomb.y})]

    let bombZIndex = getCoordinate({x: bomb.x, y: bomb.y}).indexOf(tiles.bomb.id)
    getCoordinate({x: bomb.x, y: bomb.y})[bombZIndex] = tiles.explosion.id
    let directions = [
      { active: true, x: -1,  y: 0 },
      { active: true, x: 1,   y: 0 },
      { active: true, x: 0,   y: -1 },
      { active: true, x: 0,   y: 1 }
    ]
    let foundedBombs: Array<IBomb> = []
    for (let exp = 1; exp <= bomb.power; exp++) {
      for (let direction = 0; direction < directions.length; direction++) {
        if (directions[direction].active) {
          let newPos = { x: bomb.x + (directions[direction].x * exp), y: bomb.y + (directions[direction].y * exp) }
          let layer = getLayer(newPos)
          
          if (isTileExplosivable(layer)) {
            let explosion = new Explosion(newPos)
            explosions.push(explosion)
            getCoordinate(newPos).splice(0, 0, tiles.explosion.id)
            if (arrayContains<number>(layer, tiles.bomb.id)) {
              directions[direction].active = false
              foundedBombs.push(bombManager.bombs.find(bomb => bomb.x == newPos.x && bomb.y == newPos.y))
            } else if (isTileDestructive(layer)) {
              let index = indexOfDestructibleTile(layer)
              game.scenarioBuffer[newPos.y][newPos.x][index].startAnimation()
              directions[direction].active = false
            }
          } else {
            directions[direction].active = false
          }
        }
      }
    }

    bombManager.explosions = [...bombManager.explosions, ...explosions]
    foundedBombs.forEach(foundedBomb => bombManager.explode(foundedBomb.id))

    let explosionId = setTimeout(() => { bombManager.clean(explosions) }, times.explosionDuration)
    bombManager.explosionIds.push(explosionId)
  },
  reset: () => {
    bombManager.bombs.forEach(bomb => clearTimeout(bomb.timeOut))
    bombManager.explosionIds.forEach(id => clearTimeout(id))
    bombManager.explosions.forEach(explosion => {
      explosion.stopAnimation()
      getCoordinate(explosion.position).splice(0, 1)
    })
    bombManager.bombs = []
    bombManager.explosions = []
    bombManager.explosionIds = []
  },
  clean: (explosions: Array<IExplosion>) => {
    for (let i = 0; i < explosions.length; i++) {
      let explosion = explosions[i]

      let explosionIndex = bombManager.explosions.indexOf(explosion)
      bombManager.explosions.splice(explosionIndex, 1)

      getCoordinate(explosion.position).splice(0, 1) //TODO migrate to remote first explosion sprite
      if (isTileDestructive(getCoordinate(explosion.position))) {
        getCoordinate(explosion.position).splice(0, 1) //TODO migrate to remove first box sprite
        game.scenarioBuffer[explosion.position.y][explosion.position.x].splice(1,1)
        game.onDestroyBox(explosion.position)
      }
    }
  }
}

export default bombManager