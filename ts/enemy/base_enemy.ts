import game from "../game/game.js";
import times from "../utils/times.js";
import { enemySlowMove, physicEnemyMove, isTileEnemyIIsTileAvailable } from '../utils/physics.js';
import { random, toAbsoloutePosition } from "../utils/utils.js";

abstract class BaseEnemy implements IBaseEnemy {
  public id = 0;
  public uuid: string;
  public hp = 1;
  public position: IPosition;
  public absolutePosition: IPosition;

  protected direction: IPosition = {x: 0, y: 0}
  private isInvulnerable = false;
  private moveIntervalId: number
  private destroyed = false

  public start(pos: IPosition) {
    this.uuid = Math.random().toFixed(4) + Math.random().toFixed(4)
    this.position = pos
    this.absolutePosition = toAbsoloutePosition(pos)
    this.randomAvailableDirection()
    this.startEnemy()
    this.setId()
    this.moveIntervalId = setInterval(() => {
      if (this.destroyed) return
      this.moveEnemy()
    }, times.gameUpdateMove)
  }

  protected abstract startEnemy(): void

  protected abstract setId(): void

  public update() {
    
  }

  protected findAvailableDirections(): Array<IPosition> {
    let availableDirection: Array<IPosition> = []
    if (isTileEnemyIIsTileAvailable(
      this.uuid, {x: -1, y: 0}, this.absolutePosition, {x: this.position.x - 1, y: this.position.y}, this.position)
    ) {
      availableDirection.push({x: -1, y: 0})
    }
    if (isTileEnemyIIsTileAvailable(
      this.uuid, {x: 1, y: 0}, this.absolutePosition, {x: this.position.x + 1, y: this.position.y}, this.position)
    ) {
      availableDirection.push({x: 1, y: 0})
    }
    if (isTileEnemyIIsTileAvailable(
      this.uuid, {x: 0, y: -1}, this.absolutePosition, {x: this.position.x, y: this.position.y - 1}, this.position)
    ) {
      availableDirection.push({x: 0, y: -1})
    }
    if (isTileEnemyIIsTileAvailable(
      this.uuid, {x: 0, y: 1}, this.absolutePosition, {x: this.position.x, y: this.position.y + 1}, this.position)
    ) {
      availableDirection.push({x: 0, y: 1})
    }
    return availableDirection
  }

  protected randomAvailableDirection(): IPosition {
    let availableDirection = this.findAvailableDirections()
    if (availableDirection.length > 0) {
      let selectedDirection = random(0, availableDirection.length - 1)
      return availableDirection[selectedDirection]
    }
    return this.direction
  }

  protected abstract moveEnemy(): void;

  protected move(physicsResult: IPositionMove) {
    if (physicsResult.physicalValid) {
      let enemyIndex = game.getCoordinate(this.position).indexOf(this.id)
      game.getCoordinate(this.position).splice(enemyIndex, 1)
      this.position = physicsResult.coordinatePosition
      this.absolutePosition = physicsResult.absolutePostion
      game.getCoordinate(this.position).push(this.id)
    }
  }

  protected generateNewPos(): IPositionMove {
    let nextMove = {
      x: this.absolutePosition.x + (this.direction.x * (game.tileSize / enemySlowMove)), 
      y: this.absolutePosition.y + (this.direction.y * (game.tileSize / enemySlowMove))
    }

    return physicEnemyMove(this.uuid, this.position, this.direction, this.absolutePosition, nextMove)
  }

  protected hasValidDirection(): boolean {
    return this.direction.x !== 0 || this.direction.y !== 0;
  }

  public damage() {
    if (this.isInvulnerable) return;
    
    this.hp -= 1;
    if (this.hp > 0) {
      this.isInvulnerable = true;
      setTimeout(() => this.isInvulnerable = false, times.invulnerability)
    } else {
      let enemyIndex = game.getCoordinate(this.position).indexOf(this.id)
      game.getCoordinate(this.position).splice(enemyIndex, 1)
      this.destroy()
    }
  }

  public destroy() {
    this.destroyed = true
    clearInterval(this.moveIntervalId)
  }

}

export default BaseEnemy