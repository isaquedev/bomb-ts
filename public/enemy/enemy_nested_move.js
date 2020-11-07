import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";
class EnemyNestedMove extends BaseEnemy {
    startEnemy() {
        this.hp = 2;
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
            let physicsResult = this.generateNewPos();
            if (!physicsResult.physicalValid) {
                this.findDirection();
                physicsResult = this.generateNewPos();
            }
            this.move(physicsResult);
        }
    }
}
export default EnemyNestedMove;
//# sourceMappingURL=enemy_nested_move.js.map