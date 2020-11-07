import game from "../game/game.js";
import tiles from '../game/tiles.js';
export const getTileById = (tileId) => {
    let tile;
    Object.keys(tiles).forEach(tileKey => {
        let tileItem = tiles[tileKey];
        if (tileItem.id === tileId) {
            tile = tileItem;
            return;
        }
    });
    return tile;
};
export const isTileExplosivable = (layer) => {
    let explosivable = true;
    layer.forEach(tileId => {
        let tile = getTileById(tileId);
        if (tile) {
            if (tile.physics && !tile.explosivable && tile.id !== tiles.bomb.id) {
                explosivable = false;
                return;
            }
        }
    });
    return explosivable;
};
export const isTileDestructive = (layer) => {
    let explosivable = false;
    layer.forEach(tileId => {
        let tile = getTileById(tileId);
        if (tile) {
            if (tile.explosivable) {
                explosivable = true;
                return;
            }
        }
    });
    return explosivable;
};
export const getLayer = (pos) => {
    let tilesY = game.scenario[pos.y];
    if (tilesY) {
        let tilesX = game.scenario[pos.y][pos.x];
        if (tilesX) {
            return tilesX;
        }
    }
    return [];
};
export const arrayContains = (array, value) => {
    return array.indexOf(value) !== -1;
};
//# sourceMappingURL=utils.js.map