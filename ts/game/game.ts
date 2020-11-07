import tiles from './tiles.js';
import { fase1 } from './scenarios.js';
import player from '../player/player.js';
import { getTileById, arrayContains } from '../utils/utils.js'
import enemyManager from '../enemy/enemy_manager.js';
import bombManager from '../player/bombs.js';
import times from '../utils/times.js'

const gameResize = () => {
  const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
  game.context = canvas.getContext('2d');

  let width = window.innerWidth
  let height = window.innerHeight

  let scenarioWidth = game.scenario[0].length
  let scenarioHeight = game.scenario.length

  let tileX = Math.round(width / scenarioWidth)
  let tileY = Math.round(height / scenarioHeight)

  game.tileSize = tileX < tileY ? tileX : tileY

  canvas.width = scenarioWidth * game.tileSize;
  canvas.height = scenarioHeight * game.tileSize;
}

const game: IGame = {
  context: null,
  scenario: [],
  tileSize: 48,
  updaterId: 0,
  reseting: false,
  getCoordinate: (pos: IPosition) => game.scenario[pos.y][pos.x],
  coordinateToAbsolute: (pos: IPosition) => {
    return {x: pos.x * game.tileSize, y: pos.y * game.tileSize};
  },
  forCoordinates: (doOnCoordinate: IPositionFunction) => {
    for (let y = 0; y < game.scenario.length; y++) {
      for (let x = 0; x < game.scenario[y].length; x++) {
        doOnCoordinate({x: x, y: y})
      }
    }
  },
  start: () => {
    game.reset()
    player.start()

    // window.addEventListener("resize", () => gameResize());
  },
  update: () => {
    if (game.reseting) return;

    game.forCoordinates(pos => game.drawTile(pos, tiles.ground))

    game.forCoordinates(pos => {
      let coordinate = game.getCoordinate(pos)
      for (let z = 0; z < coordinate.length; z++) {
        let tile = getTileById(coordinate[z])
        if (tile.isEnemy) {
          let enemy = enemyManager.getEnemy(pos, tile.id)
          if (enemy) {
            // tile.color = enemy.color
          }
          if (arrayContains<number>(coordinate, tiles.explosion.id)) {
            enemyManager.damage(enemy)
          }
          game.drawSprite(enemy.absolutePosition, tiles.enemySimpleMove.sprite)
          continue
        } else if (tile.isPlayer) {
          let enemy = game.getCoordinate(pos).find(id => {
            let tile = getTileById(id)
            return tile.isEnemy
          })
          if (arrayContains<number>(coordinate, tiles.explosion.id) || enemy) {
            player.damage()
          }
          game.drawSprite(player.absolutePosition, tiles.player.sprite)
          continue
        }
        game.drawTile(pos, tile)
      }
      if (arrayContains<number>(coordinate, tiles.player.id)) {
        if (arrayContains<number>(coordinate, tiles.explosion.id)
            || arrayContains<number>(coordinate, tiles.enemySimpleMove.id)) {
          player.damage()
        }
      }
    })

    player.update()
    enemyManager.update()
  },
  reset: () => {
    game.reseting = true;
    clearInterval(game.updaterId)
    bombManager.reset()

    game.scenario = JSON.parse(JSON.stringify(fase1))

    gameResize()

    player.reset()
    enemyManager.start()

    game.updaterId = setInterval(game.update, times.gameUpdate)
    game.reseting = false;
  },
  drawTile: (pos: IPosition, tile: ITileItem) => {
    let posX = pos.x * game.tileSize
    let posY = pos.y * game.tileSize

    game.drawSprite({x: posX, y: posY}, tile.sprite)
  },
  drawSprite: (pos: IPosition, sprite: string) => {
    let image = new Image()
    image.src = "./resources/images/" + sprite + ".png"
    game.context.drawImage(image, pos.x, pos.y, game.tileSize, game.tileSize)
  }
}

export default game