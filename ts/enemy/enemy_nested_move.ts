import BaseEnemy from "./base_enemy.js";
import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { isTileAvailable } from "../utils/utils.js";

class EnemyNestedMove extends BaseEnemy {

  private lastPos: IPosition

  protected startEnemy(): void {
    this.hp = 2
    this.lastPos = {x: this.position.x, y: this.position.y}
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
        physicsResult = this.generateNewPos()
      }

      if (physicsResult.coordinatePosition.x !== this.position.x || physicsResult.coordinatePosition.y !== this.position.y) {
        this.lastPos = {x: physicsResult.coordinatePosition.x, y: physicsResult.coordinatePosition.y}
      }

      this.move(physicsResult)
    }
  }

}

export default EnemyNestedMove