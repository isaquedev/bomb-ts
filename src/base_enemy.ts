import game from "./game.js";
import tilesConfig from "./tiles_config.js";
import times from "./times.js";
import { isTileAvailable } from "./utils.js";

abstract class BaseEnemy implements IBaseEnemy {
  public id = 0;
  public hp = 3;
  public position: IPosition;
  public direction: IPosition = {x: 0, y: 0}
  public isInvulnerable = false;
  public shine = false;
  public color = "red";
  public colors = { default: "red", damage: "MistyRose" }

  public start(pos: IPosition) {
    this.position = pos
    this.findDirection()
    this.startEnemy()
    this.setId()
  }

  protected abstract startEnemy(): void

  protected abstract setId(): void

  public update(skipFrame: boolean) {
    if (this.isInvulnerable) {
      this.shine = !this.shine;
    } else {
      this.shine = false
    }

    this.color = this.shine ? this.colors.damage : this.colors.default

    if (!skipFrame) {
      this.moveEnemy()
    }
  }

  protected findDirection() {
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

  protected abstract moveEnemy(): void;

  protected move(pos: IPosition) {
    let enemyIndex = game.getCoordinate(this.position).indexOf(this.id)
    game.getCoordinate(this.position).splice(enemyIndex, 1)
    this.position = pos
    game.getCoordinate(this.position).push(this.id)
  }

  protected generateNewPos(): IPosition {
    return {
      x: this.position.x + this.direction.x, 
      y: this.position.y + this.direction.y
    }
  }

  protected hasValidDirection(): boolean {
    return this.direction.x !== 0 || this.direction.y !== 0;
  }

  public damage() {
    if (this.isInvulnerable) return;

    //TODO animate enemy death
    this.hp -= 1;
    if (this.hp > 1) {
      this.isInvulnerable = true;
      setTimeout(() => this.isInvulnerable = false, times.playerInvulnerability)
    } else {
      let enemyId = tilesConfig.tiles.enemySimpleMove.id
      let enemyIndex = game.getCoordinate(this.position).indexOf(enemyId)
      game.getCoordinate(this.position).splice(enemyIndex, 1)
    }
  }
}

export default BaseEnemy