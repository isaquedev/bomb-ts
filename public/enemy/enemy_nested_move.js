import BaseEnemy from "./base_enemy.js";
import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { isTileAvailable } from "../utils/utils.js";
class EnemyNestedMove extends BaseEnemy {
    startEnemy() {
        this.hp = 2;
        this.lastPos = { x: this.position.x, y: this.position.y };
        this.colors = { default: "Teal", damage: "PaleTurquoise" };
    }
    setId() {
        this.id = tiles.enemyNestedMove.id;
    }
    moveEnemy() {
        if (!this.hasValidDirection()) {
            this.findDirection();
        }
        if (this.hasValidDirection) {
            let newPos = this.generateNewPos();
            if (!isTileAvailable(game.getCoordinate(newPos))) {
                this.findDirection();
                newPos = this.generateNewPos();
                if (newPos.x === this.lastPos.x && newPos.y === this.lastPos.y) {
                    this.findDirection();
                    newPos = this.generateNewPos();
                }
            }
            if (newPos.x !== this.position.x || newPos.y !== this.position.y) {
                this.lastPos = { x: this.position.x, y: this.position.y };
            }
            this.move(newPos);
        }
    }
}
export default EnemyNestedMove;
//# sourceMappingURL=enemy_nested_move.js.map