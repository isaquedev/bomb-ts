import game from "./game.js"
import player from "./player.js"
import tilesConfig from "./tiles_config.js"
import { getLayer, isTileExplosivable, isTileDestructive, arrayContains } from './utils.js'
import times from './times.js';

const bombManager: IBombManager = {
  bombs: [],
  explode: (id: number) => {
    console.log('explode')
    player.bomber.bombCount += 1

    let bomb = bombManager.bombs.find(bomb => bomb.id == id)
    let bombIndex = bombManager.bombs.indexOf(bomb)
    bombManager.bombs.splice(bombIndex, 1)

    clearTimeout(bomb.timeOut)
    //TODO add bombs in bombs array to explode bomb on explosion colid with them
    let explosion: Array<IPosition> = [{x: bomb.x, y: bomb.y}]

    let bombZIndex = game.getCoordinate(bomb).indexOf(tilesConfig.tiles.bomb.id)
    game.getCoordinate(bomb)[bombZIndex] = tilesConfig.tiles.explosion.id
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
            game.getCoordinate(newPos).splice(0, 0, tilesConfig.tiles.explosion.id)
            if (arrayContains(layer, tilesConfig.tiles.bomb.id)) {
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

    setTimeout(() => { bombManager.clean(explosion) }, times.explosionDuration)
  },
  clean: (explosion: Array<IPosition>) => {
    for (let i = 0; i < explosion.length; i++) {
      let pos = explosion[i]
      game.getCoordinate(pos).splice(0, 1) //TODO migrate to remote first explosion sprite
      if (isTileDestructive(game.getCoordinate(pos))) {
        game.getCoordinate(pos).splice(0, 1) //TODO migrate to remove first box sprite
      }
    }
  }
}

export default bombManager