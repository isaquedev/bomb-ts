import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { getTileById } from "./utils.js";

export const playerSpeed = 3;

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

const physicPosition: IPhysicPositionFunction = (
    direction: number,
    currentCoordinatePos: number,
    nextAbsolutePosition: number,
  ) => {
    let physicPosition: number
    let perfect = true
    if (direction > 0) {
      physicPosition = Math.ceil(nextAbsolutePosition / game.tileSize)
    } else if (direction < 0) {
      physicPosition = Math.floor(nextAbsolutePosition / game.tileSize)
    } else {
      let nextCoordinatePos = parseFloat((nextAbsolutePosition / game.tileSize).toFixed(2))
      perfect = Number.isInteger(nextCoordinatePos)
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
    let realCoordinateX = position.absolutePostion[selectedPosition] / game.tileSize
    if (position.physicalValid) {
      if (realCoordinateX > position.coordinatePosition[selectedPosition]) {
        moveToOrigin = true
      } else {
        moveToOrigin = false
      }
    } else {
      if (realCoordinateX > position.coordinatePosition[selectedPosition]) {
        physicResult[selectedPosition]++
        position.coordinatePosition[selectedPosition]++
        moveToOrigin = false
        position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition)
      } else {
        physicResult[selectedPosition]--
        position.coordinatePosition[selectedPosition]--
        moveToOrigin = true
        position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition)
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

const physicalSimplePositionResult: IPhysicalSimplePositionResult = (
  direction: number,
  coordinatePosition: number,
  nextAbsolutePosition: number,
): number => {
  let physicPosition: number
  if (direction > 0) {
    physicPosition = Math.ceil(nextAbsolutePosition / game.tileSize)
  } else if (direction < 0) {
    physicPosition = Math.floor(nextAbsolutePosition / game.tileSize)
  } else {
    physicPosition = coordinatePosition
  }
  return physicPosition
}

export const physicEnemyMove: IPhysicsMove = (
    coordinatePosition: IPosition,
    direction: IPosition,
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

  pos.physicalValid = isTileAvailable({x: physicX, y: physicY}, pos.coordinatePosition)

  return pos
}

export const isTileAvailable: IIsTileAvailable = (
  physicsPosition: IPosition,
  currentPosition: IPosition): boolean => {
  let available = true

  let physicCoordinate = game.getCoordinate(physicsPosition)

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
