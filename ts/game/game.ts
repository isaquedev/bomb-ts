import tiles from './tiles.js';
import { fases } from './scenarios.js';
import player from '../player/player.js';
import {
  getTileById, arrayContains, toAbsoloutePosition, makeImage,
  isTileDestructive, random, forCoordinates, getCoordinate
} from '../utils/utils.js'
import enemyManager from '../enemy/enemy_manager.js';
import bombManager from '../player/bombs.js';
import times from '../utils/times.js'
import AnimObject from '../utils/anim.js';

class Game implements IGame {
  private fase: number = 0
  private context: CanvasRenderingContext2D
  public scenario: Array<Array<Array<number>>> = []
  public portalBuffer: HTMLImageElement = undefined
  public scenarioBuffer: Array<Array<Array<IAnim>>> = []
  public tileSize: number = 48
  private updaterId: number = 0
  private reseting: boolean = false
  
  public start() {
    this.reset()
    player.start()
    // window.addEventListener("resize", () => gameResize());
  }

  private resize() {
    const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
    this.context = canvas.getContext('2d');
    this.context.imageSmoothingEnabled = true
  
    let width = window.innerWidth
    let height = window.innerHeight
  
    let scenarioWidth = this.scenario[0].length
    let scenarioHeight = this.scenario.length
  
    let tileX = Math.round(width / scenarioWidth)
    let tileY = Math.round(height / scenarioHeight)
  
    this.tileSize = tileX < tileY ? tileX : tileY
  
    canvas.width = scenarioWidth * this.tileSize;
    canvas.height = scenarioHeight * this.tileSize;
  }

  public update() {
    if (this.reseting) return;

    forCoordinates(pos => {
      let bufferZ = this.scenarioBuffer[pos.y][pos.x]
      for (let z = 0; z < bufferZ.length; z++) {
        this.drawSprite(toAbsoloutePosition(pos), this.scenarioBuffer[pos.y][pos.x][z].image)
      }
    })

    forCoordinates(pos => {
      let coordinate = getCoordinate(pos)
      for (let z = 0; z < coordinate.length; z++) {
        let tile = getTileById(coordinate[z])
        if (tile.isEnemy) {
          let enemy = enemyManager.getEnemy(pos, tile.id)
          if (arrayContains<number>(coordinate, tiles.explosion.id)) {
            enemyManager.damage(enemy)
          }
          if (enemy) {
            this.drawSprite(enemy.absolutePosition, makeImage(tiles.enemySimpleMove.sprite))
          }
        } else if (tile.isPlayer) {
          let enemy = getCoordinate(pos).find(id => {
            let tile = getTileById(id)
            return tile.isEnemy
          })
          if (arrayContains<number>(coordinate, tiles.explosion.id) || enemy) {
            player.damage()
          }
          this.drawSprite(player.absolutePosition, player.image)
        } else if (tile === tiles.bomb) {
          let bomb = bombManager.getBombByCoordinate(pos)
          this.drawSprite(toAbsoloutePosition(pos), bomb.image)
        } else if (tile === tiles.explosion) {
          if (!isTileDestructive(coordinate)) {
            let explosion = bombManager.getExplosionByCoordinate(pos);
            if (explosion) {
              this.drawSprite(toAbsoloutePosition(pos), explosion.image)
            }
          }
        } else if (tile === tiles.portal) {
          this.drawSprite(toAbsoloutePosition(pos), this.portalBuffer)
        }
      }
    })

    player.update()
    enemyManager.update()
  }

  public reset() {
    this.reseting = true;
    clearInterval(this.updaterId)
    bombManager.reset()

    this.portalBuffer = undefined
    this.scenario = JSON.parse(JSON.stringify(fases[this.fase]))
    this.scenarioBuffer = []

    for (let y = 0; y < this.scenario.length; y++) {
      this.scenarioBuffer.push([])
      for (let x = 0; x < this.scenario[0].length; x++) {
        this.scenarioBuffer[y].push([new AnimObject(tiles.ground.sprite, 0, false)])
        let coordinate = getCoordinate({x: x, y: y})
        let tile = getTileById(coordinate[0])
        if (tile === tiles.wall || tile === tiles.box || tile === tiles.portal) {
          this.scenarioBuffer[y][x].push(new AnimObject(tile.sprite, tile.frames, false))
        }
      }
    }

    this.resize()

    player.reset()
    enemyManager.start()

    this.updaterId = setInterval(this.update.bind(this), times.gameUpdate)
    this.reseting = false;
  }

  private drawSprite(pos: IPosition, image: HTMLImageElement) {
    this.context.drawImage(image, pos.x, pos.y, this.tileSize, this.tileSize)
  }

  public onDestroyBox(pos: IPosition) {
    let chance = random(1, 100)
    if (chance > 80) {
      game.portalBuffer = makeImage(tiles.portal.sprite)
      getCoordinate(pos).push(tiles.portal.id)
    }
  }

}

const game = new Game()

export default game