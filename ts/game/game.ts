import tiles from './tiles.js';
import { fase1 } from './scenarios.js';
import player from '../player/player.js';
import { getTileById, arrayContains, toAbsoloutePosition, makeImage, isTileDestructive } from '../utils/utils.js'
import enemyManager from '../enemy/enemy_manager.js';
import bombManager from '../player/bombs.js';
import times from '../utils/times.js'
import AnimObject from '../utils/anim.js';

const gameResize = () => {
  const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
  game.context = canvas.getContext('2d');
  game.context.imageSmoothingEnabled = true

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
  scenarioBuffer: [],
  tileSize: 48,
  updaterId: 0,
  reseting: false,
  firstDraw: true,
  getCoordinate: (pos: IPosition) => game.scenario[pos.y][pos.x],
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

    game.forCoordinates(pos => {
      let bufferZ = game.scenarioBuffer[pos.y][pos.x]
      for (let z = 0; z < bufferZ.length; z++) {
        game.drawSprite(toAbsoloutePosition(pos), game.scenarioBuffer[pos.y][pos.x][z].image)
      }
    })

    game.forCoordinates(pos => {
      let coordinate = game.getCoordinate(pos)
      for (let z = 0; z < coordinate.length; z++) {
        let tile = getTileById(coordinate[z])
        if (tile.isEnemy) {
          let enemy = enemyManager.getEnemy(pos, tile.id)
          if (arrayContains<number>(coordinate, tiles.explosion.id)) {
            enemyManager.damage(enemy)
          }
          game.drawSprite(enemy.absolutePosition, makeImage(tiles.enemySimpleMove.sprite))
          continue
        } else if (tile.isPlayer) {
          let enemy = game.getCoordinate(pos).find(id => {
            let tile = getTileById(id)
            return tile.isEnemy
          })
          if (arrayContains<number>(coordinate, tiles.explosion.id) || enemy) {
            player.damage()
          }
          game.drawSprite(player.absolutePosition, player.image)
          continue
        } else if (tile === tiles.bomb) {
          let bomb = bombManager.getBombByCoordinate(pos)
          game.drawSprite(toAbsoloutePosition(pos), bomb.image)
          continue
        } else if (tile === tiles.explosion) {
          if (!isTileDestructive(coordinate)) {
            let explosion = bombManager.getExplosionByCoordinate(pos);
            if (explosion) {
              game.drawSprite(toAbsoloutePosition(pos), explosion.image)
            }
            continue;
          }
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

    game.firstDraw = true
    game.scenario = JSON.parse(JSON.stringify(fase1))
    game.scenarioBuffer = []

    for (let y = 0; y < game.scenario.length; y++) {
      game.scenarioBuffer.push([])
      for (let x = 0; x < game.scenario[0].length; x++) {
        game.scenarioBuffer[y].push([new AnimObject(tiles.ground.sprite, 0, false)])
        let coordinate = game.getCoordinate({x: x, y: y})
        let tile = getTileById(coordinate[0])
        if (tile === tiles.wall || tile === tiles.box) {
          game.scenarioBuffer[y][x].push(new AnimObject(tile.sprite, tile.frames, false))
        }
      }
    }

    gameResize()

    player.reset()
    enemyManager.start()

    game.updaterId = setInterval(game.update, times.gameUpdate)
    game.reseting = false;
  },
  drawSprite: (pos: IPosition, image: HTMLImageElement) => {
    game.context.drawImage(image, pos.x, pos.y, game.tileSize, game.tileSize)
  }
}

export default game