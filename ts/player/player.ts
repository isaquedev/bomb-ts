import game from "../game/game.js"
import {
  arrayContains, forCoordinates, getCoordinate, toAbsoloutePosition
} from '../utils/utils.js';
import tiles from '../game/tiles.js';
import bombManager from './bombs.js';
import times from '../utils/times.js';
import { playerSpeed, physicMove } from '../utils/physics.js'
import Bomb from "./bomb.js";

interface IAnimDirections {
  [key: string]: Array<HTMLImageElement>
  left: Array<HTMLImageElement>;
  right: Array<HTMLImageElement>
  top: Array<HTMLImageElement>
  bot: Array<HTMLImageElement> 
}

class Player implements IPlayer {
  public position: IPosition = {x: 1, y: 1}
  public absolutePosition: IPosition = {x: 0, y: 0}
  public bomber: IBomber = {bombPower: 1, bombCount: 1}

  public image: HTMLImageElement
  public images: IAnimDirections = {
    left: [],
    right: [],
    top: [],
    bot: []
  }
  public direction: IPosition
  public frame = 0
  private maxFrames = 8
  public moving = false

  private moveId = 0

  private skip = false;
  private hp = 1
  private dead = false
  private isInvulnerable = false
  private shine = false
  private moveSpeed: number
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

    let folder = "../resources/animations/player"

    for (let i = 0; i < this.maxFrames; i++) {
      Object.keys(this.images).forEach(dir => {
        let image = new Image()
        image.src = folder + "/" + dir +  "/" + i + ".png"
        this.images[dir].push(image)
      })
    }

    this.image = this.images.bot[0]

    setInterval(() => {
      if (!this.moving) {
        this.frame = 0
      } else if (this.frame === this.maxFrames - 1) {
        this.frame = 0
      } else {
        this.frame++
      }
      this.image = this.directionToImages()[this.frame]
    }, times.gameUpdateMoveAnim)

    setInterval(() => {
      this.move()
    }, times.gameUpdateMove)
  }

  private directionToImages(): Array<HTMLImageElement> {
    if (this.direction.x === 0 && this.direction.y === 0) {
      return this.images.bot
    } else if (this.direction.x === 1) {
      return this.images.right
    } else if (this.direction.x === -1) {
      return this.images. left
    } else if (this.direction.y === 1) {
      return this.images.bot
    } else {
      return this.images.top
    }
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
      if (direction.x !== this.direction.x || direction.y !== this.direction.y) {
        this.frame = 0
      }

      this.direction = direction

      let newPos: IPosition = {
        x: this.absolutePosition.x + (direction.x * this.moveSpeed),
        y: this.absolutePosition.y + (direction.y * this.moveSpeed),
      }
      
      let physicsResult = physicMove(this.position, direction, newPos)

      if (physicsResult.physicalValid) {
        this.moving = true
        let playerTile = tiles.player
        let playerIndexInLayer = getCoordinate(this.position).indexOf(playerTile.id)

        getCoordinate(this.position).splice(playerIndexInLayer, 1)
        this.position = physicsResult.coordinatePosition
        getCoordinate(physicsResult.coordinatePosition).push(playerTile.id)
        this.absolutePosition = physicsResult.absolutePostion
      } else {
        this.moving = false
      }
    } else {
      this.moving = false
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
    forCoordinates(pos => {
      if (arrayContains<number>(getCoordinate(pos), tiles.player.id)) {
        this.position = pos
        this.direction = {x: 0, y: 0}
        this.absolutePosition = toAbsoloutePosition(pos)
      }
    })
  }

  public leaveBomb() {
    if (!this.actions.status.leaveBomb) return;

    this.actions.status.leaveBomb = false

    if (this.bomber.bombCount == 0) return;

    let pos = this.position

    let layer = getCoordinate(pos)
    let bomb = tiles.bomb
    if (layer.indexOf(bomb.id) === -1) {
      let bombId = Math.random()

      this.bomber.bombCount -= 1;

      bombManager.bombs.push(new Bomb(
        bombId, pos.x, pos.y, this.bomber.bombPower,
        setTimeout(() => bombManager.explode(bombId), times.bombDelayToExplode)))

      layer.unshift(bomb.id)
    }
  }

}

const player = new Player()

export default player