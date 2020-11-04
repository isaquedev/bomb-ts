import game from "./game.js"
import tilesConfig from './tiles_config.js';

export const getTileById: IGetTileById = (tileId: number): ITileItem => {
  let tile: ITileItem;

  Object.keys(tilesConfig.tiles).forEach(tileKey => {
    let tileItem = tilesConfig.tiles[tileKey]
    if (tileItem.id === tileId) {
      tile = tileItem
      return;
    }
  })

  return tile;
}

export const isTileAvailable: IIsTileAvailable = (layer: Array<number>): boolean => {
  let available = true
  layer.forEach(tileId => {
    let tile = getTileById(tileId)
    if (tile) {
      if (tile.physics) {
        available = false;
        return;
      }
    }
  })
  return available;
}

export const isTileExplosivable: IIsTileExplosivable = (layer: Array<number>): boolean => {
  let explosivable = true
  layer.forEach(tileId => {
    let tile = getTileById(tileId)
    //TODO bomba precisa não ser atravessável e precisa ser acionada pela explosão
    if (tile) {
      if (tile.physics && !tile.explosivable && tile.id !== tilesConfig.tiles.bomb.id) {
        explosivable = false;
        return;
      }
    }
  })
  return explosivable
}

export const isTileDestructive: IIsTileDestructive = (layer: Array<number>): boolean => {
  let explosivable = false
  layer.forEach(tileId => {
    let tile = getTileById(tileId)
    //TODO bomba precisa não ser atravessável e precisa ser acionada pela explosão
    if (tile) {
      if (tile.explosivable) {
        explosivable = true;
        return;
      }
    }
  })
  return explosivable
}

export const getLayer: IGetLayer = (pos: IPosition): Array<number> => {
  let tilesY = game.scenario[pos.y]
  if (tilesY) {
    let tilesX = game.scenario[pos.y][pos.x]
    if (tilesX) {
      return tilesX
    }
  }
  return []
}

export const arrayContains: IArrayContains = <T>(array: Array<T>, value: T): boolean => {
  return array.indexOf(value) !== -1;
}