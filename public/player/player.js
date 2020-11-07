import game from "../game/game.js";
import { arrayContains } from '../utils/utils.js';
import tiles from '../game/tiles.js';
import bombManager from './bombs.js';
import times from '../utils/times.js';
import { tileSize, playerSpeed, physicMove } from '../utils/physics.js';
class Player {
    constructor() {
        this.position = { x: 1, y: 1 };
        this.absolutePosition = { x: 0, y: 0 };
        this.bomber = { bombPower: 2, bombCount: 3 };
        this.skip = false;
        this.hp = 1;
        this.dead = false;
        this.isInvulnerable = false;
        this.shine = false;
        this.moveSpeed = 4;
        this.actions = {
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
        };
    }
    start() {
        document.addEventListener('keydown', event => {
            let action = this.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode);
            if (action) {
                this.actions.status[action.name] = true;
            }
        });
        document.addEventListener('keyup', event => {
            let action = this.actions.keyCodes.find(keyCode => keyCode.key === event.keyCode);
            if (action) {
                this.actions.status[action.name] = false;
            }
        });
    }
    update() {
        if (this.dead)
            return;
        this.skip = !this.skip;
        if (this.skip)
            return;
        if (this.isInvulnerable) {
            this.shine = !this.shine;
        }
        else {
            this.shine = false;
        }
        this.move();
        this.leaveBomb();
    }
    damage() {
        if (this.isInvulnerable || this.dead)
            return;
        if (this.hp > 1) {
            this.hp -= 1;
            this.isInvulnerable = true;
            setTimeout(() => this.isInvulnerable = false, times.invulnerability);
        }
        else {
            alert('player dead');
            this.dead = true;
            game.reset();
        }
    }
    move() {
        let direction;
        if (player.actions.status.moveLeft) {
            direction = { x: -1, y: 0 };
        }
        else if (player.actions.status.moveRight) {
            direction = { x: 1, y: 0 };
        }
        else if (player.actions.status.moveTop) {
            direction = { x: 0, y: -1 };
        }
        else if (player.actions.status.moveBot) {
            direction = { x: 0, y: 1 };
        }
        if (direction) {
            let newPos = {
                x: this.absolutePosition.x + (direction.x * this.moveSpeed),
                y: this.absolutePosition.y + (direction.y * this.moveSpeed),
            };
            let physicsResult = physicMove(this.position, direction, newPos);
            if (physicsResult.physicalValid) {
                let playerTile = tiles.player;
                let playerIndexInLayer = game.getCoordinate(this.position).indexOf(playerTile.id);
                game.getCoordinate(this.position).splice(playerIndexInLayer, 1);
                this.position = physicsResult.coordinatePosition;
                game.getCoordinate(physicsResult.coordinatePosition).push(playerTile.id);
                this.absolutePosition = physicsResult.absolutePostion;
            }
        }
    }
    reset() {
        this.dead = false;
        this.isInvulnerable = false;
        this.hp = 1;
        this.moveSpeed = tileSize / playerSpeed;
        game.forCoordinates(pos => {
            if (arrayContains(game.getCoordinate(pos), tiles.player.id)) {
                this.position = pos;
                this.absolutePosition = game.coordinateToAbsolute(pos);
            }
        });
    }
    leaveBomb() {
        if (this.bomber.bombCount == 0)
            return;
        let pos = this.position;
        let layer = game.getCoordinate(pos);
        let bomb = tiles.bomb;
        if (this.actions.status.leaveBomb && layer.indexOf(bomb.id) === -1) {
            let bombId = Math.random();
            this.bomber.bombCount -= 1;
            bombManager.bombs.push({
                id: bombId,
                x: pos.x,
                y: pos.y,
                power: this.bomber.bombPower,
                timeOut: setTimeout(() => bombManager.explode(bombId), times.bombDelayToExplode)
            });
            layer.splice(0, 0, bomb.id);
        }
    }
}
const player = new Player();
export default player;
//# sourceMappingURL=player.js.map