import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";
import { physicMove } from "../utils/physics.js";

class EnemySimpleMove extends BaseEnemy {

  protected startEnemy(): void {
    this.hp = 1
  }

  protected setId() {
    this.id = tiles.enemySimpleMove.id
  }
  
  protected moveEnemy(): void {
    if (!this.hasValidDirection()) {
      this.findDirection();
    }

    if (this.hasValidDirection) {
      let physicsResult = this.generateNewPos()

      if (!physicsResult.physicalValid) {
        this.direction = { x: this.direction.x * -1, y: this.direction.y * -1 }
        physicsResult = this.generateNewPos()
      }

      this.move(physicsResult)
    }
  }

}

export default EnemySimpleMove

