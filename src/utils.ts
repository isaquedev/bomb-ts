import game from "./game.js"
import tilesConfig from './tiles_config.js';

interface IIsValidCoordinate { (coordinate: IPosition, isPlayer?: boolean): boolean }

export const isValidCoordinate: IIsValidCoordinate = (coordinate: IPosition, isPlayer = false): boolean => {
  return coordinate.x >= 0 && coordinate.x < game.scenario.length && coordinate.y >= 0 && coordinate.y < game.scenario[0].length
}

interface IGetTileById { (tileId: number): ITileItem }

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

interface IIsTileAvailable { (layer: Array<number>): boolean }

export const isTileAvailable: IIsTileAvailable = (layer: Array<number>): boolean => {
  let available = layer.length > 0
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

interface IIsTileExplosivable { (layer: Array<number>): boolean }

export const isTileExplosivable: IIsTileExplosivable = (layer: Array<number>): boolean => {
  let explosivable = layer.length > 0
  layer.forEach(tileId => {
    let tile = getTileById(tileId)
    //TODO bomba precisa não ser atravessável e precisa ser acionada pela explosão
    if (tile) {
      if (tile.physics && !tile.explosivable) {
        explosivable = false;
        return;
      }
    }
  })
  return explosivable
}

interface IIsTileDestructive { (layer: Array<number>): boolean }

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


interface IGetLayer { (pos: IPosition): Array<number> }

export const getLayer: IGetLayer = (pos: IPosition): Array<number> => {
  let tilesX = game.scenario[pos.x]
  if (tilesX) {
    let tilesY = game.scenario[pos.x][pos.y]
    if (tilesY) {
      return tilesY
    }
  }
  return []
}

interface IGetBombIndex { (pos: IPosition): number }

export const getBombIndex: IGetBombIndex = (pos: IPosition): number => {
  let bombTile = tilesConfig.tiles.bomb
  let bombIndex = game.scenario[pos.x][pos.y].indexOf(bombTile.id)
  return bombIndex
}