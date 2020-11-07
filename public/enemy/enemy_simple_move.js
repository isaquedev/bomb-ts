import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";
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
            let physicsResult = this.generateNewPos();
            if (!physicsResult.physicalValid) {
                this.direction = { x: this.direction.x * -1, y: this.direction.y * -1 };
                return;
            }
            this.move(physicsResult);
        }
    }
}
export default EnemySimpleMove;
//# sourceMappingURL=enemy_simple_move.js.map