import game from "./game.js"
import { arrayContains } from './utils.js';
import tiles from './tiles.js';
import bombManager from './bombs.js';
import times from './times.js';
import { tileSize, tileHalfSize, physicMove } from './physics.js'

class Player implements IPlayer {
  public position: IPosition = {x: 1, y: 1}
  public absolutePosition: IPosition = {x: 0, y: 0}
  public bomber: IBomber = {bombPower: 2, bombCount: 3}
  public sprite: string = '../resources/images/player.png'

  private skip = false;
  private hp = 1
  private dead = false
  private isInvulnerable = false
  private shine = false
  private moveSpeed = 4
  private actions: IPlayerActions = {
    keyCodes: [
      { key: 87, name: 'moveTop' },
      { key: 83, name: 'moveBot' },
      { key: 65, name: 'moveLeft' },
      { key: 68, name: 'moveRight' },
      { key: 32, name: 'leaveBomb' },
    ],
    status: {
      moveTop: false,
      moveBot: false,
      moveLeft: false,
      moveRight: false,
      leaveBomb: false
    }
  }

  public start() {
    document.addEventListener('keydown', event => {
      let action = this.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode)
      if (action) {
        this.actions.status[action.name] = true
      }
    });
    document.addEventListener('keyup', event => {
      let action = this.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode)
      if (action) {
        this.actions.status[action.name] = false
      }
    });
  }

  public update() {
    if (this.dead) return;

    this.skip = !this.skip
    if (this.skip) return;

    if (this.isInvulnerable) {
      this.shine = !this.shine
    } else {
      this.shine = false
    }

    tiles.player.color = this.shine ? "LightCyan" : "blue"

    this.move()
    this.leaveBomb()
  }

  public damage() {
    if (this.isInvulnerable || this.dead) return;

    if (this.hp > 1) {
      this.hp -= 1;
      this.isInvulnerable = true

      setTimeout(() => this.isInvulnerable = false, times.playerInvulnerability)
    } else {
      //TODO player death state
      alert('player dead')
      this.dead = true

      game.reset()
    }
  }

  public move() {
    let direction: IPosition
    if (player.actions.status.moveLeft) { //Move left
      direction = {x: -1, y: 0}
    } else if (player.actions.status.moveRight) { //Move right
      direction = {x: 1, y: 0}
    } else if (player.actions.status.moveTop) { //Move top
      direction = {x: 0, y: -1}
    } else if (player.actions.status.moveBot) { //Move bot
      direction = {x: 0, y: 1}
    }

    if (direction) {
      let newPos: IPosition = {
        x: this.absolutePosition.x + (direction.x * this.moveSpeed),
        y: this.absolutePosition.y + (direction.y * this.moveSpeed),
      }
      
      let physicsResult = physicMove(this.position, direction, newPos)

      if (physicsResult.physicalValid) {
        let playerTile = tiles.player
        let playerIndexInLayer = game.getCoordinate(this.position).indexOf(playerTile.id)

        game.getCoordinate(this.position).splice(playerIndexInLayer, 1)
        this.position = physicsResult.coordinatePosition
        game.getCoordinate(physicsResult.coordinatePosition).push(playerTile.id)
        this.absolutePosition = physicsResult.absolutePostion
      }
    }
  }

  public reset() {
    this.dead = false
    this.isInvulnerable = false
    this.hp = 1
    this.moveSpeed = tileSize / tileHalfSize
    game.forCoordinates(pos => {
      if (arrayContains<number>(game.getCoordinate(pos), tiles.player.id)) {
        this.position = pos
        this.absolutePosition = game.coordinateToAbsolute(pos)
      }
    })
  }

  public leaveBomb() {
    if (this.bomber.bombCount == 0) return;

    let pos = this.position

    let layer = game.getCoordinate(pos)
    let bomb = tiles.bomb
    if (this.actions.status.leaveBomb && layer.indexOf(bomb.id) === -1) {
      let bombId = Math.random()

      this.bomber.bombCount -= 1;

      bombManager.bombs.push({
        id: bombId,
        x: pos.x,
        y: pos.y,
        power: this.bomber.bombPower,
        timeOut: setTimeout(() => bombManager.explode(bombId), times.bombDelayToExplode)
      })

      layer.splice(0, 0, bomb.id)
    }
  }

}

const player = new Player()

export default player