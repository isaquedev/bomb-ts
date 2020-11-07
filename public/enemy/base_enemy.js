import game from "../game/game.js";
import times from "../utils/times.js";
import { tileSize, enemySlowMove, physicEnemyMove, isTileAvailable } from '../utils/physics.js';
class BaseEnemy {
    constructor() {
        this.id = 0;
        this.hp = 1;
        this.color = "red";
        this.colors = { default: "red", damage: "MistyRose" };
        this.direction = { x: 0, y: 0 };
        this.isInvulnerable = false;
        this.shine = false;
    }
    start(pos) {
        this.position = pos;
        this.absolutePosition = { x: pos.x * tileSize, y: pos.y * tileSize };
        this.findDirection();
        this.startEnemy();
        this.setId();
    }
    update(skipFrame) {
        if (this.hp === 0) {
            this.shine = false;
            this.color = this.colors.default;
            return;
        }
        if (this.isInvulnerable) {
            this.shine = !this.shine;
        }
        else {
            this.shine = false;
        }
        this.color = this.shine ? this.colors.damage : this.colors.default;
        if (!skipFrame) {
            this.moveEnemy();
        }
    }
    findDirection() {
        let moveHorizontaly = Math.round(Math.random()) == 1;
        if (moveHorizontaly) {
            let direction = this.findHorizontalyDirection();
            if (direction) {
                this.direction = direction;
            }
            else {
                direction = this.findVerticalyDirection();
                if (direction) {
                    this.direction = direction;
                }
            }
        }
        else {
            let direction = this.findVerticalyDirection();
            if (direction) {
                this.direction = direction;
            }
            else {
                direction = this.findHorizontalyDirection();
                if (direction) {
                    this.direction = direction;
                }
            }
        }
    }
    findHorizontalyDirection() {
        let checkLeftFirst = Math.round(Math.random()) == 1;
        if (checkLeftFirst) {
            if (isTileAvailable({ x: this.position.x - 1, y: this.position.y }, this.position)) {
                return this.direction = { x: -1, y: 0 };
            }
            else if (isTileAvailable({ x: this.position.x + 1, y: this.position.y }, this.position)) {
                return this.direction = { x: 1, y: 0 };
            }
        }
        else {
            if (isTileAvailable({ x: this.position.x + 1, y: this.position.y }, this.position)) {
                return this.direction = { x: 1, y: 0 };
            }
            else if (isTileAvailable({ x: this.position.x - 1, y: this.position.y }, this.position)) {
                return this.direction = { x: -1, y: 0 };
            }
        }
        return undefined;
    }
    findVerticalyDirection() {
        let checkTopFirst = Math.round(Math.random()) == 1;
        if (checkTopFirst) {
            if (isTileAvailable({ x: this.position.x, y: this.position.y - 1 }, this.position)) {
                return this.direction = { x: 0, y: -1 };
            }
            else if (isTileAvailable({ x: this.position.x, y: this.position.y + 1 }, this.position)) {
                return this.direction = { x: 0, y: 1 };
            }
        }
        else {
            if (isTileAvailable({ x: this.position.x, y: this.position.y + 1 }, this.position)) {
                return this.direction = { x: 0, y: 1 };
            }
            else if (isTileAvailable({ x: this.position.x, y: this.position.y - 1 }, this.position)) {
                return this.direction = { x: 0, y: -1 };
            }
        }
        return undefined;
    }
    move(physicsResult) {
        if (physicsResult.physicalValid) {
            let enemyIndex = game.getCoordinate(this.position).indexOf(this.id);
            game.getCoordinate(this.position).splice(enemyIndex, 1);
            this.position = physicsResult.coordinatePosition;
            this.absolutePosition = physicsResult.absolutePostion;
            game.getCoordinate(this.position).splice(0, 0, this.id);
        }
    }
    generateNewPos() {
        let nextMove = {
            x: this.absolutePosition.x + (this.direction.x * (tileSize / enemySlowMove)),
            y: this.absolutePosition.y + (this.direction.y * (tileSize / enemySlowMove))
        };
        return physicEnemyMove(this.position, this.direction, nextMove);
    }
    hasValidDirection() {
        return this.direction.x !== 0 || this.direction.y !== 0;
    }
    damage() {
        if (this.isInvulnerable)
            return;
        this.hp -= 1;
        if (this.hp > 0) {
            this.isInvulnerable = true;
            setTimeout(() => this.isInvulnerable = false, times.invulnerability);
        }
        else {
            let enemyIndex = game.getCoordinate(this.position).indexOf(this.id);
            game.getCoordinate(this.position).splice(enemyIndex, 1);
        }
    }
}
export default BaseEnemy;
//# sourceMappingURL=base_enemy.js.map