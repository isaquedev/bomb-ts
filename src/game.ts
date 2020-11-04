import tilesConfig from './tiles_config.js';
import { fase1 } from './scenarios.js';
import player from './player.js';
import { getTileById, arrayContains } from './utils.js'

const game: IGame = {
  context: null,
  scenario: fase1,
  getCoordinate: (pos: IPosition) => game.scenario[pos.y][pos.x],
  start: () => {
    const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
    game.context = canvas.getContext('2d');
  
    canvas.width = game.scenario[0].length * tilesConfig.tileSize;
    canvas.height = game.scenario.length * tilesConfig.tileSize;

    player.object.methods.start()

    game.update()
    setInterval(game.update, 100)
  },
  update: () => {
    for (let y = 0; y < game.scenario.length; y++) {
      for (let x = 0; x < game.scenario[y].length; x++) {
        game.drawTile({x: x, y: y}, tilesConfig.tiles.ground)
        let coordinate = game.getCoordinate({x: x, y: y})
        for (let z = 0; z < coordinate.length; z++) {
          let tile = getTileById(coordinate[z])
          game.drawTile({x: x, y: y}, tile)
        }
        if (arrayContains(coordinate, tilesConfig.tiles.player.id)
          && arrayContains(coordinate, tilesConfig.tiles.explosion.id)) {
          player.object.methods.damage()
        }
      }
    }
    player.object.methods.update()
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