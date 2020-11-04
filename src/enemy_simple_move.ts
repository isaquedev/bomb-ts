import BaseEnemy from "./base_enemy.js";
import game from "./game.js";
import tilesConfig from "./tiles_config.js";
import { isTileAvailable } from "./utils.js";

class EnemySimpleMove extends BaseEnemy {

  protected startEnemy(): void {
    this.hp = 1
  }

  protected setId() {
    this.id = tilesConfig.tiles.enemySimpleMove.id
  }
  
  protected moveEnemy(): void {
    if (!this.hasValidDirection()) {
      this.findDirection();
    }

    if (this.hasValidDirection) {
      let newPos = this.generateNewPos()

      if (!isTileAvailable(game.getCoordinate(newPos))) {
        this.direction = { x: this.direction.x * -1, y: this.direction.y * -1 }
        newPos = this.generateNewPos()
      }

      this.move(newPos)
    }
  }

}

export default EnemySimpleMove

