import game from "./game.js"
import player from "./player.js"
import tiles from "./tiles.js"
import { getLayer, isTileExplosivable, isTileDestructive, arrayContains } from './utils.js'
import times from './times.js';

const bombManager: IBombManager = {
  bombs: [],
  explosion: [],
  explosionIds: [],
  explode: (id: number) => {
    player.bomber.bombCount += 1

    let bomb = bombManager.bombs.find(bomb => bomb.id == id)
    let bombIndex = bombManager.bombs.indexOf(bomb)
    bombManager.bombs.splice(bombIndex, 1)

    clearTimeout(bomb.timeOut)
    //TODO add bombs in bombs array to explode bomb on explosion colid with them
    let explosion: Array<IPosition> = [{x: bomb.x, y: bomb.y}]

    let bombZIndex = game.getCoordinate(bomb).indexOf(tiles.bomb.id)
    game.getCoordinate(bomb)[bombZIndex] = tiles.explosion.id
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
            explosion.push(newPos)
            bombManager.explosion.push(newPos)
            game.getCoordinate(newPos).splice(0, 0, tiles.explosion.id)
            if (arrayContains<number>(layer, tiles.bomb.id)) {
              directions[direction].active = false
              foundedBombs.push(bombManager.bombs.find(bomb => bomb.x == newPos.x && bomb.y == newPos.y))
            } else if (isTileDestructive(layer)) {
              directions[direction].active = false
            }
          } else {
            directions[direction].active = false
          }
        }
      }
    }

    foundedBombs.forEach(foundedBomb => {
      bombManager.explode(foundedBomb.id)
    })

    let explosionId = setTimeout(() => { bombManager.clean(explosion) }, times.explosionDuration)
    bombManager.explosionIds.push(explosionId)
  },
  reset: () => {
    bombManager.explosionIds.forEach(id => clearTimeout(id))
    bombManager.explosion.forEach(explosion => {
      game.getCoordinate(explosion).splice(0, 1)
    })
  },
  clean: (explosion: Array<IPosition>) => {
    for (let i = 0; i < explosion.length; i++) {
      let pos = explosion[i]

      let explosionIndex = bombManager.explosion.indexOf(pos)
      bombManager.explosion.splice(explosionIndex, 1)

      game.getCoordinate(pos).splice(0, 1) //TODO migrate to remote first explosion sprite
      if (isTileDestructive(game.getCoordinate(pos))) {
        game.getCoordinate(pos).splice(0, 1) //TODO migrate to remove first box sprite
      }
    }
  }
}

export default bombManager