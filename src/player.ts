import game from "./game.js"
import { arrayContains, isTileAvailable } from './utils.js';
import tilesConfig from './tiles_config.js';
import bombManager from './bombs.js';
import times from './times.js';

const player: IPlayer = {
  hp: 1,
  dead: false,
  isInvulnerable: false,
  shine: false,
  position: {x: 1, y: 1},
  start: () => {
    document.addEventListener('keydown', event => {
      let action = player.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode)
      if (action) {
        player.actions.status[action.name] = true
      }
    });
    document.addEventListener('keyup', event => {
      let action = player.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode)
      if (action) {
        player.actions.status[action.name] = false
      }
    });
    player.reset()
  },
  update: () => {
    if (player.dead) return;

    if (player.isInvulnerable) {
      player.shine = !player.shine
    } else {
      player.shine = false
    }

    tilesConfig.tiles.player.color = player.shine ? "LightCyan" : "blue"

    player.move()
    player.leaveBomb()
  },
  damage: () => {
    if (player.isInvulnerable || player.dead) return;

    if (player.hp > 1) {
      //TODO damage animation
      player.hp -= 1;
      player.isInvulnerable = true

      setTimeout(() => player.isInvulnerable = false, times.playerInvulnerability)
    } else {
      alert('player dead')
      //TODO death animation
      player.dead = true

      game.reset()
    }
  },
  move: () => {
    let newPos: IPosition
    let pos = player.position
    if (player.actions.status.moveLeft) { //Move left
      newPos = { x: pos.x - 1, y: pos.y }
    } else if (player.actions.status.moveRight) { //Move right
      newPos = { x: pos.x + 1, y: pos.y }
    } else if (player.actions.status.moveTop) { //Move top
      newPos = { x: pos.x, y: pos.y - 1 }
    } else if (player.actions.status.moveBot) { //Move bot
      newPos = { x: pos.x, y: pos.y + 1 }
    }

    if (newPos && isTileAvailable(game.getCoordinate(newPos))) {
      let playerTile = tilesConfig.tiles.player
      let playerIndexInLayer = game.getCoordinate(pos).indexOf(playerTile.id)

      game.getCoordinate(pos).splice(playerIndexInLayer, 1)
      player.position = newPos
      game.getCoordinate(newPos).push(playerTile.id)
    }
  },
  reset: () => {
    player.dead = false
    player.isInvulnerable = false
    player.hp = 1
    game.forCoordinates(pos => {
      if (arrayContains<number>(game.getCoordinate(pos), tilesConfig.tiles.player.id)) {
        player.position = pos
      }
    })
  },
  bomber: {
    bombPower: 2,
    bombCount: 3
  },
  leaveBomb: () => {
    if (player.bomber.bombCount == 0) return;

    let pos = player.position

    let layer = game.getCoordinate(pos)
    let bomb = tilesConfig.tiles.bomb
    if (player.actions.status.leaveBomb && layer.indexOf(bomb.id) === -1) {
      let bombId = Math.random()

      player.bomber.bombCount -= 1;

      bombManager.bombs.push({
        id: bombId,
        x: pos.x,
        y: pos.y,
        power: player.bomber.bombPower,
        timeOut: setTimeout(() => bombManager.explode(bombId), times.bombDelayToExplode)
      })

      layer.splice(0, 0, bomb.id)
    }
  },
  actions: {
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
}

export default player