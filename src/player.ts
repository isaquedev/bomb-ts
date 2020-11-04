import game from "./game.js"
import { isTileAvailable } from './utils.js';
import tilesConfig from './tiles_config.js';
import bombManager from './bombs.js';
import times from './times.js';

const player: IPlayer = {
  object: {
    params: {
      hp: 1,
      dead: false,
      isInvulnerable: false,
      position: {x: 0, y: 0}
    },
    methods: {
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
        player.object.methods.move()
        player.leaveBomb()
      },
      damage: () => {
        if (player.object.params.isInvulnerable || player.object.params.dead) return;
    
        if (player.object.params.hp > 1) {
          //TODO damage animation
          player.object.params.hp -= 1;
          player.object.params.isInvulnerable = true
          setTimeout(() => player.object.params.isInvulnerable = false, times.playerInvulnerability)
          console.log('damage')
        } else {
          //TODO death animation
          player.object.params.dead = true
          alert('Player dead')
        }
      },
      move: () => {
        let newPos: IPosition
        let pos = player.object.params.position
        if (player.actions.status.moveLeft) { //Move left
          if (pos.x > 0) {
            newPos = { x: pos.x - 1, y: pos.y }
          }
        } else if (player.actions.status.moveRight) { //Move right
          if (pos.x < game.scenario.length - 1) {
            newPos = { x: pos.x + 1, y: pos.y }
          }
        } else if (player.actions.status.moveTop) { //Move top
          if (pos.y > 0) {
            newPos = { x: pos.x, y: pos.y - 1 }
          }
        } else if (player.actions.status.moveBot) { //Move bot
          if (pos.y < game.scenario[0].length - 1) {
            newPos = { x: pos.x, y: pos.y + 1 }
          }
        }
    
        if (newPos && isTileAvailable(game.scenario[newPos.x][newPos.y])) {
          let playerTile = tilesConfig.tiles.player
          let playerIndexInLayer = game.scenario[pos.x][pos.y].indexOf(playerTile.id)
    
          game.scenario[pos.x][pos.y].splice(playerIndexInLayer, 1)
          player.object.params.position = newPos
          game.scenario[newPos.x][newPos.y].push(playerTile.id)
        }
      }
    }
  },
  bomber: {
    bombPower: 2,
    bombCount: 3
  },
  leaveBomb: () => {
    if (player.bomber.bombCount == 0) return;

    let pos = player.object.params.position

    let layer = game.scenario[pos.x][pos.y]
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

      layer.splice(1, 0, bomb.id)
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