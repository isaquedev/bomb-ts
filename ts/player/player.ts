import game from "../game/game.js"
import { arrayContains } from '../utils/utils.js';
import tiles from '../game/tiles.js';
import bombManager from './bombs.js';
import times from '../utils/times.js';
import { playerSpeed, physicMove } from '../utils/physics.js'

class Player implements IPlayer {
  public position: IPosition = {x: 1, y: 1}
  public absoluteCoordinatePosition: IPosition = {x: 0, y: 0}
  public absolutePosition: IPosition = {x: 0, y: 0}
  public bomber: IBomber = {bombPower: 1, bombCount: 1}

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

    this.move()
    this.leaveBomb()
  }

  public damage() {
    if (this.isInvulnerable || this.dead) return;

    if (this.hp > 1) {
      this.hp -= 1;
      this.isInvulnerable = true

      setTimeout(() => this.isInvulnerable = false, times.invulnerability)
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
        this.absoluteCoordinatePosition = {
          x: this.absolutePosition.x / game.tileSize,
          y: this.absolutePosition.y / game.tileSize
        }
      }
    }
  }

  public reset() {
    this.dead = false
    this.isInvulnerable = false
    this.hp = 1
    this.bomber = {bombCount: 1, bombPower: 1}
    this.moveSpeed = game.tileSize / playerSpeed
    this.actions.status = {
      leaveBomb: false,
      moveBot: false,
      moveLeft: false,
      moveRight: false,
      moveTop: false
    }
    game.forCoordinates(pos => {
      if (arrayContains<number>(game.getCoordinate(pos), tiles.player.id)) {
        this.position = pos
        this.absolutePosition = game.coordinateToAbsolute(pos)
        this.absoluteCoordinatePosition = pos
      }
    })
  }

  public leaveBomb() {
    if (!this.actions.status.leaveBomb) return;

    this.actions.status.leaveBomb = false

    if (this.bomber.bombCount == 0) return;

    let pos = this.position

    let layer = game.getCoordinate(pos)
    let bomb = tiles.bomb
    if (layer.indexOf(bomb.id) === -1) {
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