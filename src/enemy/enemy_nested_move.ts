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
      let newPos = this.generateNewPos()

      if (!isTileAvailable(game.getCoordinate(newPos))) {
        this.findDirection()
        newPos = this.generateNewPos()
        if (newPos.x === this.lastPos.x && newPos.y === this.lastPos.y) {
          this.findDirection()
          newPos = this.generateNewPos()
        }
      }

      if (newPos.x !== this.position.x || newPos.y !== this.position.y) {
        this.lastPos = {x: this.position.x, y: this.position.y}
      }

      this.move(newPos)
    }
  }

}

export default EnemyNestedMove