import enemyManager from "../enemy/enemy_manager.js";
import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { getCoordinate, getTileById, roundToFixed } from "./utils.js";

export const playerSpeed = 5;

export const enemyFastMove = 7

export const enemySlowMove = 9;

interface IPhysicPositionFunction { 
  (
    direction: number,
    currentCoordinatePos: number,
    nextAbsolutePosition: number,
  ) : IPhysicPositionResult
}

interface IPhysicPositionResult {
  perfect: boolean,
  physicPosition: number
}

const isCenteredPosition = (absolutePosition: number): boolean => {
  let nextCoordinatePos = parseFloat((absolutePosition / game.tileSize).toFixed(2))
  return Number.isInteger(nextCoordinatePos)
}

const physicPosition: IPhysicPositionFunction = (
    direction: number,
    currentCoordinatePos: number,
    nextAbsolutePosition: number,
  ) => {
    let physicPosition: number
    let perfect = true
    let nextAproximatedAbsolutePosition = parseFloat(nextAbsolutePosition.toFixed(2))
    if (direction > 0) {
      physicPosition = Math.ceil(parseFloat((nextAbsolutePosition / game.tileSize).toFixed(2)))
    } else if (direction < 0) {
      physicPosition = Math.floor(parseFloat((nextAbsolutePosition / game.tileSize).toFixed(2)))
    } else {
      perfect = isCenteredPosition(nextAproximatedAbsolutePosition)
      physicPosition = currentCoordinatePos
    }

    return {
      perfect,
      physicPosition
    }
}

interface IPhysicAdjustAbsolutePosition {
  (
    perfect: boolean,
    physicResult: IPosition,
    position: IPositionMove,
    selectedPosition: string,
  ): IPositionMove
}

const physicAdjustAbsolutePosition: IPhysicAdjustAbsolutePosition = (
  perfect: boolean,
  physicResult: IPosition,
  position: IPositionMove,
  selectedPosition: string,
) => {
  if (!perfect) {
    let moveToOrigin: boolean
    let realCoordinate = roundToFixed(position.absolutePostion[selectedPosition] / game.tileSize, 1)
    if (position.physicalValid) {
      if (realCoordinate > position.coordinatePosition[selectedPosition]) {
        moveToOrigin = true
      } else {
        moveToOrigin = false
      }
    } else {
      let dist = Math.abs(roundToFixed(realCoordinate - position.coordinatePosition[selectedPosition], 1))
      if (dist >= 0.4) {
        if (realCoordinate > position.coordinatePosition[selectedPosition]) {
          physicResult[selectedPosition]++
            position.coordinatePosition[selectedPosition]++
            moveToOrigin = false
            position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition)
        } else if (realCoordinate < position.coordinatePosition[selectedPosition]) {
          physicResult[selectedPosition]--
            position.coordinatePosition[selectedPosition]--
            moveToOrigin = true
            position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition)
        }
      }
    }

    if (position.physicalValid) {
      if (moveToOrigin) {
        position.absolutePostion[selectedPosition] -= (game.tileSize / playerSpeed)
      } else {
        position.absolutePostion[selectedPosition] += (game.tileSize / playerSpeed)
      }
    }
  }

  return position
}

export const physicMove: IPhysicsMove = (
    coordinatePosition: IPosition,
    direction: IPosition,
    nextAbsolutePosition: IPosition
  ) => {
  let pos: IPositionMove = {
    absolutePostion: {x: nextAbsolutePosition.x, y: nextAbsolutePosition.y},
    coordinatePosition: {x: 0, y: 0},
    physicalValid: false
  }

  let physicResultX = physicPosition(direction.x, coordinatePosition.x, nextAbsolutePosition.x)
  let physicResultY = physicPosition(direction.y, coordinatePosition.y, nextAbsolutePosition.y)
  let physicResult: IPosition = {x: physicResultX.physicPosition, y: physicResultY.physicPosition}

  pos.coordinatePosition = {
    x: Math.round(nextAbsolutePosition.x / game.tileSize),
    y: Math.round(nextAbsolutePosition.y / game.tileSize),
  }

  pos.physicalValid = isTileAvailable(physicResult, pos.coordinatePosition)

  pos = physicAdjustAbsolutePosition(physicResultX.perfect, physicResult, pos, 'x')
  pos = physicAdjustAbsolutePosition(physicResultY.perfect, physicResult, pos, 'y')

  return pos
}

interface IPhysicalSimplePositionResult {
  (
    direction: number,
    coordinatePosition: number,
    nextAbsolutePosition: number,
  ): number
}

export const isTileAvailable: IIsTileAvailable = (
  physicsPosition: IPosition,
  currentPosition: IPosition): boolean => {
  let available = true

  let physicCoordinate = getCoordinate(physicsPosition)

  physicCoordinate.forEach(tileId => {
    let tile = getTileById(tileId)
    if (tile) {
      if (tile.physics) {
        if (tile !== tiles.bomb) {
          available = false;
        } else if (physicsPosition.x !== currentPosition.x || physicsPosition.y !== currentPosition.y) {
          available = false;
        }
        return;
      }
    }
  })
  return available;
}

const physicalSimplePositionResult: IPhysicalSimplePositionResult = (
  direction: number,
  coordinatePosition: number,
  nextAbsolutePosition: number,
): number => {
  let physicPosition: number
  if (direction > 0) {
    physicPosition = Math.ceil(parseFloat((nextAbsolutePosition / game.tileSize).toFixed(2)))
  } else if (direction < 0) {
    physicPosition = Math.floor(parseFloat((nextAbsolutePosition / game.tileSize).toFixed(2)))
  } else {
    physicPosition = coordinatePosition
  }
  return physicPosition
}

export const physicEnemyMove: IPhysicsEnemyMove = (
    enemyUuid: string,
    coordinatePosition: IPosition,
    direction: IPosition,
    currentAbsolutePosition: IPosition,
    nextAbsolutePosition: IPosition
  ) => {
  let pos: IPositionMove = {
    absolutePostion: {x: nextAbsolutePosition.x, y: nextAbsolutePosition.y},
    coordinatePosition: {x: 0, y: 0},
    physicalValid: false
  }

  let physicX = physicalSimplePositionResult(direction.x, coordinatePosition.x, nextAbsolutePosition.x)
  let physicY = physicalSimplePositionResult(direction.y, coordinatePosition.y, nextAbsolutePosition.y)

  pos.coordinatePosition = {
    x: Math.round(nextAbsolutePosition.x / game.tileSize),
    y: Math.round(nextAbsolutePosition.y / game.tileSize),
  }

  pos.physicalValid = isTileEnemyIIsTileAvailable(
    enemyUuid,
    direction,
    currentAbsolutePosition,
    {x: physicX, y: physicY},
    pos.coordinatePosition
  )

  return pos
}

export const isTileEnemyIIsTileAvailable: IIsTileEnemyAvailable = (
  enemyUuid: string,
  direction: IPosition,
  absolutePosition: IPosition,
  physicsPosition: IPosition,
  currentPosition: IPosition): boolean => {
    let available = true

  let physicCoordinate = getCoordinate(physicsPosition)

  if (direction.x !== 0) {
    let perfectY = isCenteredPosition(absolutePosition.y)
    if (!perfectY) {
      return false
    }
  } else {
    let perfectX = isCenteredPosition(absolutePosition.x)
    if (!perfectX) {
      return false
    }
  }

  physicCoordinate.forEach(tileId => {
    let tile = getTileById(tileId)
    if (tile) {
      if (tile.physics) {
        if (tile !== tiles.bomb) {
          available = false;
        } else if (physicsPosition.x !== currentPosition.x || physicsPosition.y !== currentPosition.y) {
          available = false;
        }
        return;
      } else if (tile.isEnemy) {
        let enemies = enemyManager.getAllEnemies(physicsPosition, tileId)
        if (enemies) {
          let otherEnemy = enemies.find(enemy => enemy.uuid !== enemyUuid)
          if (otherEnemy) {
            enemyUuid
            available = false;
          }
        }
        return;
      }
    }
  })

  return available;
}
