import game from "./game.js";
import { isTileAvailable } from "./utils.js";

export const tileHalfSize = 3;

export const tileSize = 48;

export const physicMove: IPhysicsMove = (coordinatePosition: IPosition, direction: IPosition, nextAbsolutePosition: IPosition) => {
  let pos: IPositionMove = {absolutePostion: {x: nextAbsolutePosition.x, y: nextAbsolutePosition.y}, coordinatePosition: {x: 0, y: 0}, physicalValid: false}
  let physicsPosition: IPosition = {x: 0, y: 0}
  let nextPos: IPosition = {x:0, y:0}
  let perfectX = true
  let perfectY = true

  if (direction.x > 0) {
    physicsPosition.x = Math.ceil(nextAbsolutePosition.x / tileSize)
  } else if (direction.x < 0) {
    physicsPosition.x = Math.floor(nextAbsolutePosition.x / tileSize)
  } else {
    nextPos.x = parseFloat((nextAbsolutePosition.x / tileSize).toFixed(2))
    perfectX = Number.isInteger(nextPos.x)
    physicsPosition.x = coordinatePosition.x
  }

  if (direction.y > 0) {
    physicsPosition.y = Math.ceil(nextAbsolutePosition.y / tileSize)
  } else if (direction.y < 0) {
    physicsPosition.y = Math.floor(nextAbsolutePosition.y / tileSize)
  } else {
    nextPos.y = parseFloat((nextAbsolutePosition.y / tileSize).toFixed(2))
    perfectY = Number.isInteger(nextPos.y)
    physicsPosition.y = coordinatePosition.y
  }

  pos.coordinatePosition = {
    x: Math.round(nextAbsolutePosition.x / tileSize),
    y: Math.round(nextAbsolutePosition.y / tileSize),
  }

  if (!perfectX) {
    let realCoordinateX = nextAbsolutePosition.x / tileSize
    if (realCoordinateX - physicsPosition.x > 0) {
      pos.absolutePostion.x -= (tileSize / tileHalfSize)
    } else {
      pos.absolutePostion.x += (tileSize / tileHalfSize)
    }
  }

  if (!perfectY) {
    let realCoordinateY = nextAbsolutePosition.y / tileSize
    if (realCoordinateY - physicsPosition.y > 0) {
      pos.absolutePostion.y -= (tileSize / tileHalfSize)
    } else {
      pos.absolutePostion.y += (tileSize / tileHalfSize)
    }
  }

  pos.physicalValid = isTileAvailable(game.getCoordinate(physicsPosition))

  return pos
}