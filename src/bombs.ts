import game from "./game.js"
import player from "./player.js"
import tilesConfig from "./tiles_config.js"
import { getLayer, isTileExplosivable, isTileDestructive } from './utils.js'
import times from './times.js';

const bombManager: IBombManager = {
  bombs: [],
  explode: (id: number, pos: IPosition, power: number) => {
    player.bomber.bombCount += 1

    let bomb = bombManager.bombs.find(bomb => bomb.id == id)
    let bombIndex = bombManager.bombs.indexOf(bomb)
    bombManager.bombs.splice(bombIndex, 1)

    clearTimeout(bomb.timeOut)
    //TODO add bombs in bombs array to explode bomb on explosion colid with them
    let explosion: Array<IPosition> = [{x: pos.x, y: pos.y}]

    let bombZIndex = game.scenario[pos.x][pos.y].indexOf(tilesConfig.tiles.bomb.id)
    game.scenario[pos.x][pos.y][bombZIndex] = tilesConfig.tiles.explosion.id
    let directions = [
      { active: true, x: -1,  y: 0 },
      { active: true, x: 1,   y: 0 },
      { active: true, x: 0,   y: -1 },
      { active: true, x: 0,   y: 1 }
    ]
    for (let exp = 1; exp <= power; exp++) {
      for (let direction = 0; direction < directions.length; direction++) {
        if (directions[direction].active) {
          let newPos = { x: pos.x + (directions[direction].x * exp), y: pos.y + (directions[direction].y * exp) }
          let layer = getLayer(newPos)
          
          if (isTileExplosivable(layer)) {
            explosion.push(newPos)
            game.scenario[newPos.x][newPos.y].splice(1, 0, tilesConfig.tiles.explosion.id)
            if (isTileDestructive(layer)) {
              directions[direction].active = false
            }
          } else {
            directions[direction].active = false
          }
        }
      }
    }
    setTimeout(() => { bombManager.clean(explosion) }, times.explosionDuration)
  },
  clean: (explosion: Array<IPosition>) => {
    for (let i = 0; i < explosion.length; i++) {
      let pos = explosion[i]
      game.scenario[pos.x][pos.y].splice(1, 1) //TODO migrate to remote first explosion sprite
      if (isTileDestructive(game.scenario[pos.x][pos.y])) {
        game.scenario[pos.x][pos.y].splice(1, 1) //TODO migrate to remove first box sprite
      }
    }
  }
}

export default bombManager