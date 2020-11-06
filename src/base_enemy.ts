import game from "./game.js";
import times from "./times.js";
import { isTileAvailable } from "./utils.js";

abstract class BaseEnemy implements IBaseEnemy {
  public id = 0;
  public hp = 1;
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
    if (this.hp === 0) {
      this.shine = false;
      this.color = this.colors.default
      return;
    }

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
    let moveHorizontaly = Math.round(Math.random()) == 1

    if (moveHorizontaly) {
      let direction = this.findHorizontalyDirection()
      if (direction) {
        this.direction = direction;
      } else {
        direction = this.findVerticalyDirection()
        if (direction) {
          this.direction = direction
        }
      }
    } else {
      let direction = this.findVerticalyDirection()
      if (direction) {
        this.direction = direction
      } else {
        direction = this.findHorizontalyDirection()
        if (direction) {
          this.direction = direction
        }
      }
    }
  }

  private findHorizontalyDirection(): IPosition {
    let checkLeftFirst = Math.round(Math.random()) == 1

    if (checkLeftFirst) {
      if (isTileAvailable(game.getCoordinate({x: this.position.x - 1, y: this.position.y}))) {
        return this.direction = {x: -1, y: 0}
      } else if (isTileAvailable(game.getCoordinate({x: this.position.x + 1, y: this.position.y}))) {
        return this.direction = {x: 1, y: 0}
      }
    } else {
      if (isTileAvailable(game.getCoordinate({x: this.position.x + 1, y: this.position.y}))) {
        return this.direction = {x: 1, y: 0}
      } else if (isTileAvailable(game.getCoordinate({x: this.position.x - 1, y: this.position.y}))) {
        return this.direction = {x: -1, y: 0}
      }
    }

    return undefined
  }

  private findVerticalyDirection(): IPosition {
    let checkTopFirst = Math.round(Math.random()) == 1

    if (checkTopFirst) {
      if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y - 1}))) {
        return this.direction = {x: 0, y: -1}
      } else if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y + 1}))) {
        return this.direction = {x: 0, y: 1}
      }
    } else {
      if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y + 1}))) {
        return this.direction = {x: 0, y: 1}
      } else if (isTileAvailable(game.getCoordinate({x: this.position.x, y: this.position.y - 1}))) {
        return this.direction = {x: 0, y: -1}
      }
    }

    return undefined
  }

  protected abstract moveEnemy(): void;

  protected move(pos: IPosition) {
    let enemyIndex = game.getCoordinate(this.position).indexOf(this.id)
    game.getCoordinate(this.position).splice(enemyIndex, 1)
    this.position = pos
    game.getCoordinate(this.position).splice(0, 0, this.id)
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
    this.hp -= 1;
    if (this.hp > 0) {
      this.isInvulnerable = true;
      setTimeout(() => this.isInvulnerable = false, times.playerInvulnerability)
    } else {
      //TODO enemy death animation
      let enemyIndex = game.getCoordinate(this.position).indexOf(this.id)
      game.getCoordinate(this.position).splice(enemyIndex, 1)
    }
  }
}

export default BaseEnemy