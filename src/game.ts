import tilesConfig from './tiles_config.js';
import { fase1 } from './scenarios.js';
import player from './player.js';
import { getTileById, arrayContains } from './utils.js'

const game: IGame = {
  context: null,
  scenario: fase1,
  start: () => {
    const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
    game.context = canvas.getContext('2d');
  
    canvas.width = game.scenario.length * tilesConfig.tileSize;
    canvas.height = game.scenario[0].length * tilesConfig.tileSize;

    player.object.methods.start()

    game.update()
    setInterval(game.update, 100)
  },
  update: () => {
    for (let x = 0; x < game.scenario.length; x++) {
      for (let y = 0; y < game.scenario[x].length; y++) {
        for (let z = 0; z < game.scenario[x][y].length; z++) {
          let tileId: number = game.scenario[x][y][z]
          let tile = getTileById(tileId)

          game.context.fillStyle = tile.color
          let size = tile.size

          let posX = x * tilesConfig.tileSize + (tilesConfig.tileSize / 100 * (tilesConfig.tileSize - size))
          let posY = y * tilesConfig.tileSize + (tilesConfig.tileSize / 100 * (tilesConfig.tileSize - size))
          game.context.fillRect(posX, posY, size, size);
        }
        if (arrayContains(game.scenario[x][y], tilesConfig.tiles.player.id) && arrayContains(game.scenario[x][y], tilesConfig.tiles.explosion.id)) {
          player.object.methods.damage()
        }
      }
    }
    player.object.methods.update()
  }
}

export default game