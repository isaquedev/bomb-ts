import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { getTileById } from "./utils.js";
export const playerSpeed = 3;
export const enemyFastMove = 7;
export const enemySlowMove = 9;
export const tileSize = 48;
const physicPosition = (direction, currentCoordinatePos, nextAbsolutePosition) => {
    let physicPosition;
    let perfect = true;
    if (direction > 0) {
        physicPosition = Math.ceil(nextAbsolutePosition / tileSize);
    }
    else if (direction < 0) {
        physicPosition = Math.floor(nextAbsolutePosition / tileSize);
    }
    else {
        let nextCoordinatePos = parseFloat((nextAbsolutePosition / tileSize).toFixed(2));
        perfect = Number.isInteger(nextCoordinatePos);
        physicPosition = currentCoordinatePos;
    }
    return {
        perfect,
        physicPosition
    };
};
const physicAdjustAbsolutePosition = (perfect, physicResult, position, selectedPosition) => {
    if (!perfect) {
        let moveToOrigin;
        let realCoordinateX = position.absolutePostion[selectedPosition] / tileSize;
        if (position.physicalValid) {
            if (realCoordinateX > position.coordinatePosition[selectedPosition]) {
                moveToOrigin = true;
            }
            else {
                moveToOrigin = false;
            }
        }
        else {
            if (realCoordinateX > position.coordinatePosition[selectedPosition]) {
                physicResult[selectedPosition]++;
                position.coordinatePosition[selectedPosition]++;
                moveToOrigin = false;
                position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition);
            }
            else {
                physicResult[selectedPosition]--;
                position.coordinatePosition[selectedPosition]--;
                moveToOrigin = true;
                position.physicalValid = isTileAvailable(physicResult, position.coordinatePosition);
            }
        }
        if (position.physicalValid) {
            if (moveToOrigin) {
                position.absolutePostion[selectedPosition] -= (tileSize / playerSpeed);
            }
            else {
                position.absolutePostion[selectedPosition] += (tileSize / playerSpeed);
            }
        }
    }
    return position;
};
export const physicMove = (coordinatePosition, direction, nextAbsolutePosition) => {
    let pos = {
        absolutePostion: { x: nextAbsolutePosition.x, y: nextAbsolutePosition.y },
        coordinatePosition: { x: 0, y: 0 },
        physicalValid: false
    };
    let physicResultX = physicPosition(direction.x, coordinatePosition.x, nextAbsolutePosition.x);
    let physicResultY = physicPosition(direction.y, coordinatePosition.y, nextAbsolutePosition.y);
    let physicResult = { x: physicResultX.physicPosition, y: physicResultY.physicPosition };
    pos.coordinatePosition = {
        x: Math.round(nextAbsolutePosition.x / tileSize),
        y: Math.round(nextAbsolutePosition.y / tileSize),
    };
    pos.physicalValid = isTileAvailable(physicResult, pos.coordinatePosition);
    pos = physicAdjustAbsolutePosition(physicResultX.perfect, physicResult, pos, 'x');
    pos = physicAdjustAbsolutePosition(physicResultY.perfect, physicResult, pos, 'y');
    return pos;
};
const physicalSimplePositionResult = (direction, coordinatePosition, nextAbsolutePosition) => {
    let physicPosition;
    if (direction > 0) {
        physicPosition = Math.ceil(nextAbsolutePosition / tileSize);
    }
    else if (direction < 0) {
        physicPosition = Math.floor(nextAbsolutePosition / tileSize);
    }
    else {
        physicPosition = coordinatePosition;
    }
    return physicPosition;
};
export const physicEnemyMove = (coordinatePosition, direction, nextAbsolutePosition) => {
    let pos = {
        absolutePostion: { x: nextAbsolutePosition.x, y: nextAbsolutePosition.y },
        coordinatePosition: { x: 0, y: 0 },
        physicalValid: false
    };
    let physicX = physicalSimplePositionResult(direction.x, coordinatePosition.x, nextAbsolutePosition.x);
    let physicY = physicalSimplePositionResult(direction.y, coordinatePosition.y, nextAbsolutePosition.y);
    pos.coordinatePosition = {
        x: Math.round(nextAbsolutePosition.x / tileSize),
        y: Math.round(nextAbsolutePosition.y / tileSize),
    };
    pos.physicalValid = isTileAvailable({ x: physicX, y: physicY }, pos.coordinatePosition);
    return pos;
};
export const isTileAvailable = (physicsPosition, currentPosition) => {
    let available = true;
    let physicCoordinate = game.getCoordinate(physicsPosition);
    physicCoordinate.forEach(tileId => {
        let tile = getTileById(tileId);
        if (tile) {
            if (tile.physics) {
                if (tile !== tiles.bomb) {
                    available = false;
                }
                else if (physicsPosition.x !== currentPosition.x || physicsPosition.y !== currentPosition.y) {
                    available = false;
                }
                return;
            }
        }
    });
    return available;
};
//# sourceMappingURL=physics.js.map