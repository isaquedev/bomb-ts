import game from "./game.js"
import { isTileAvailable } from './utils.js';
import tilesConfig from './tiles_config.js';
import bombManager from './bombs.js';
import times from './times.js';

const player: IPlayer = {
  hp: 10,
  isInvulnerable: false,
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
  },
  update: () => {
    player.move()
    player.leaveBomb()
  },
  position: {
    x: 0,
    y: 0
  },
  damage: () => {
    if (player.isInvulnerable) return;

    if (player.hp > 0) {
      player.hp -= 1;
      player.isInvulnerable = true
      setTimeout(() => player.isInvulnerable = false, times.playerInvulnerability)
      //TODO damage animation
      console.log('damage')
    }
  },
  move: () => {
    let newPos: IPosition
    if (player.actions.status.moveLeft) { //Move left
      if (player.position.x > 0) {
        newPos = { x: player.position.x - 1, y: player.position.y }
      }
    } else if (player.actions.status.moveRight) { //Move right
      if (player.position.x < game.scenario.length - 1) {
        newPos = { x: player.position.x + 1, y: player.position.y }
      }
    } else if (player.actions.status.moveTop) { //Move top
      if (player.position.y > 0) {
        newPos = { x: player.position.x, y: player.position.y - 1 }
      }
    } else if (player.actions.status.moveBot) { //Move bot
      if (player.position.y < game.scenario[0].length - 1) {
        newPos = { x: player.position.x, y: player.position.y + 1 }
      }
    }

    if (newPos && isTileAvailable(game.scenario[newPos.x][newPos.y])) {
      let playerTile = tilesConfig.tiles.player
      let playerIndexInLayer = game.scenario[player.position.x][player.position.y].indexOf(playerTile.id)

      game.scenario[player.position.x][player.position.y].splice(playerIndexInLayer, 1)
      player.position = newPos
      game.scenario[newPos.x][newPos.y].push(playerTile.id)
    }
  },
  leaveBomb: () => {
    let layer = game.scenario[player.position.x][player.position.y]
    let bomb = tilesConfig.tiles.bomb
    if (player.actions.status.leaveBomb && layer.indexOf(bomb.id) === -1) {
      let bombId = Math.random()

      let pos = player.position

      bombManager.bombs.push({
        id: bombId,
        x: pos.x,
        y: pos.y,
        timeOut: setTimeout(() => bombManager.explode(bombId, pos), times.bombDelayToExplode)
      })

      layer.splice(1, 0, bomb.id)
    }
  },
  actions: {
    keyCodes: [
      {key: 87, name: 'moveTop'},
      {key: 83, name: 'moveBot'},
      {key: 65, name: 'moveLeft'},
      {key: 68, name: 'moveRight'},
      {key: 32, name: 'leaveBomb'},
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