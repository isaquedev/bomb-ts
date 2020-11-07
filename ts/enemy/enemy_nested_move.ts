import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";
import { random } from "../utils/utils.js";

//When the current direction don't are valid
//the enemy find a new random valid direction

//When have another valid direction during the path
//the enemy has 30% chance of chancing his direction
class EnemyNestedMove extends BaseEnemy {

  private changeChance = 30

  protected startEnemy(): void {
    this.hp = 2
    this.colors = {default: "Teal", damage: "PaleTurquoise"}
  }

  protected setId(): void {
    this.id = tiles.enemyNestedMove.id
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
      } else {
        let availableDirections = this.findAvailableDirections()
        let anotherAvailableDirection = availableDirections.find(direction => {
          return direction.x !== this.direction.x && direction.y !== this.direction.y
          && direction.x !== this.direction.x * -1 && direction.y !== this.direction.y * -1 
        })
        if (anotherAvailableDirection) {
          let changeDirection = random(1, 100)
          if (changeDirection > 100 - this.changeChance) {
            this.direction = anotherAvailableDirection
          }
          physicsResult = this.generateNewPos()
        }
      }

      this.move(physicsResult)
    }
  }

}

export default EnemyNestedMove