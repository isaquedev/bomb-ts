import BaseEnemy from "./base_enemy.js";
import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { isTileAvailable } from "../utils/utils.js";
class EnemySimpleMove extends BaseEnemy {
    startEnemy() {
        this.hp = 1;
    }
    setId() {
        this.id = tiles.enemySimpleMove.id;
    }
    moveEnemy() {
        if (!this.hasValidDirection()) {
            this.findDirection();
        }
        if (this.hasValidDirection) {
            let newPos = this.generateNewPos();
            if (!isTileAvailable(game.getCoordinate(newPos))) {
                this.direction = { x: this.direction.x * -1, y: this.direction.y * -1 };
                newPos = this.generateNewPos();
            }
            this.move(newPos);
        }
    }
}
export default EnemySimpleMove;
//# sourceMappingURL=enemy_simple_move.js.map