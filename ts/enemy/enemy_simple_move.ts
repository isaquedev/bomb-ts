import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";

//When the current direction don't are valid
//the enemy find a new random valid direction
class EnemySimpleMove extends BaseEnemy {

  protected startEnemy(): void {
    this.hp = 1
  }

  protected setId() {
    this.id = tiles.enemySimpleMove.id
  }
  
  protected moveEnemy(): void {
    if (!this.hasValidDirection()) {
      this.direction = this.randomAvailableDirection();
    }

    if (this.hasValidDirection) {
      let physicsResult = this.generateNewPos()

      if (!physicsResult.physicalValid) {
        this.direction = this.randomAvailableDirection()
        physicsResult = this.generateNewPos()
      }

      this.move(physicsResult)
    }
  }

}

export default EnemySimpleMove

