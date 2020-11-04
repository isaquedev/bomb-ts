import tilesConfig from './tiles_config.js';
import { fase1 } from './scenarios.js';
import player from './player.js';
import { getTileById, arrayContains } from './utils.js'
import enemyManager from './enemy_manager.js';
import bombManager from './bombs.js';

const game: IGame = {
  context: null,
  scenario: [],
  updaterId: 0,
  reseting: false,
  getCoordinate: (pos: IPosition) => game.scenario[pos.y][pos.x],
  forCoordinates: (doOnCoordinate: IPositionFunction) => {
    for (let y = 0; y < game.scenario.length; y++) {
      for (let x = 0; x < game.scenario[y].length; x++) {
        doOnCoordinate({x: x, y: y})
      }
    }
  },
  start: () => {
    const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
    game.context = canvas.getContext('2d');

    game.reset()

    canvas.width = game.scenario[0].length * tilesConfig.tileSize;
    canvas.height = game.scenario.length * tilesConfig.tileSize;

    player.start()
  },
  update: () => {
    if (game.reseting) return;

    game.forCoordinates(pos => {
      game.drawTile(pos, tilesConfig.tiles.ground)
        let coordinate = game.getCoordinate(pos)
        for (let z = 0; z < coordinate.length; z++) {
          let tile = getTileById(coordinate[z])
          if (tile === tilesConfig.tiles.enemySimpleMove) {
            let enemy = enemyManager.getEnemy(pos)
            if (enemy) {
              tile.color = enemy.color
            }
          }
          game.drawTile(pos, tile)
        }
        if (arrayContains<number>(coordinate, tilesConfig.tiles.explosion.id)) {
          if (arrayContains<number>(coordinate, tilesConfig.tiles.player.id)) {
            player.damage()
          }
          if (arrayContains<number>(coordinate, tilesConfig.tiles.enemySimpleMove.id)) {
            enemyManager.damage(pos)
          }
        }
        if (arrayContains<number>(coordinate, tilesConfig.tiles.enemySimpleMove.id)) {
          if (arrayContains<number>(coordinate, tilesConfig.tiles.player.id)) {
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

    player.reset()
    enemyManager.start()

    game.updaterId = setInterval(game.update, 100)
    game.reseting = false;
  },
  drawTile: (pos: IPosition, tile: ITileItem) => {
    game.context.fillStyle = tile.color
    let size = tile.size

    let posX = pos.x * tilesConfig.tileSize + (tilesConfig.tileSize / 100 * (tilesConfig.tileSize - size))
    let posY = pos.y * tilesConfig.tileSize + (tilesConfig.tileSize / 100 * (tilesConfig.tileSize - size))
    game.context.fillRect(posX, posY, size, size);
  }
}

export default game