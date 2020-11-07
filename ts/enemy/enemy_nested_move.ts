import BaseEnemy from "./base_enemy.js";
import tiles from "../game/tiles.js";

//When the current direction don't are valid
//the enemy find a new random valid direction
class EnemyNestedMove extends BaseEnemy {

  protected startEnemy(): void {
    this.hp = 2
    this.colors = {default: "Teal", damage: "PaleTurquoise"}
  }

  protected setId(): void {
    this.id = tiles.enemyNestedMove.id
  }

  protected moveEnemy(): void {
    if (!this.hasValidDirection()) {
      this.findDirection();
    }

    if (this.hasValidDirection) {
      let physicsResult = this.generateNewPos()

      if (!physicsResult.physicalValid) {
        this.findDirection()

        // use this code in a more complex enemy
        // let oldDirection: IPosition = {x: this.direction.x, y: this.direction.y}
        // let tries = 2
        // for (let i = 0; i < tries; i++) {
        //   this.findDirection()
        //   if (this.direction.x !== oldDirection.x * -1
        //     && this.direction.y !== oldDirection.y * -1) {
        //       console.log('new', this.direction, 'old', oldDirection)
        //       break
        //   }
        // }

        physicsResult = this.generateNewPos()
      }

      this.move(physicsResult)
    }
  }

}

export default EnemyNestedMove