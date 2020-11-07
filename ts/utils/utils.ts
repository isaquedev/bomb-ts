import game from "../game/game.js"
import tiles from '../game/tiles.js';

export const getTileById: IGetTileById = (tileId: number): ITileItem => {
  let tile: ITileItem;

  Object.keys(tiles).forEach(tileKey => {
    let tileItem = tiles[tileKey]
    if (tileItem.id === tileId) {
      tile = tileItem
      return;
    }
  })

  return tile;
}

export const isTileExplosivable: IIsTileExplosivable = (layer: Array<number>): boolean => {
  let explosivable = true
  layer.forEach(tileId => {
    let tile = getTileById(tileId)
    if (tile) {
      if (tile.physics && !tile.explosivable && tile.id !== tiles.bomb.id) {
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

interface IRandom { (min: number, max: number): number }

export const random: IRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}