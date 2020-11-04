import game from "./game.js";
import tilesConfig from "./tiles_config.js";
import { isTileAvailable } from "./utils.js";

interface IEnemySimpleMove {
  object: ILiveObject;
}

class EnemySimpleMove {
  public hp = 1;
  public position: IPosition;
  public direction: IPosition = {x: 0, y: 0}

  public start(pos: IPosition) {
    this.position = pos
    this.findDirection()
  }

  public update() {
    this.move()
  }

  private findDirection() {
    if (isTileAvailable(game.getCoordinate({x: this.position.x - 1, y: this.position.y}))) {
      this.direction = {x: -1, y: 0}
      return;
    }

    if (isTileAvailable(game.getCoordinate({x: this.position.x + 1, y: this.position.y}))) {
      this.direction = {x: 1, y: 0}
      return;
    }

    if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y - 1}))) {
      this.direction = {x: 0, y: -1}
      return;
    }

    if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y + 1}))) {
      this.direction = {x: 0, y: 1}
    }
  }

  private move() {
    if (this.hasValidDirection()) {
      this.findDirection();
    }

    if (this.hasValidDirection) {
      let newPos = this.generateNewPos()

      if (!isTileAvailable(game.getCoordinate(newPos))) {
        this.direction = { x: this.direction.x * -1, y: this.direction.y * -1 }
        newPos = this.generateNewPos()
      }

      let enemyId = tilesConfig.tiles.enemySimpleMove.id
      let enemyIndex = game.getCoordinate(this.position).indexOf(enemyId)
      game.getCoordinate(this.position).splice(enemyIndex, 1)
      this.position = newPos
      game.getCoordinate(this.position).push(enemyId)
    }
  }

  private generateNewPos(): IPosition {
    return {
      x: this.position.x + this.direction.x, 
      y: this.position.y + this.direction.y
    }
  }

  private hasValidDirection(): boolean {
    return this.direction === {x: 0, y: 0};
  }

  public damage() {
    //TODO animate enemy death
    let enemyId = tilesConfig.tiles.enemySimpleMove.id
    let enemyIndex = game.getCoordinate(this.position).indexOf(enemyId)
    game.getCoordinate(this.position).splice(enemyIndex, 1)
  }

}

export default EnemySimpleMove

