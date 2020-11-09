import tiles from '../game/tiles.js';
import game from '../game/game.js';

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

interface IToAbsolutePosition { (coordinate: IPosition): IPosition }

export const toAbsoloutePosition: IToAbsolutePosition = (coordinate: IPosition): IPosition => {
  return {x: coordinate.x * game.tileSize, y: coordinate.y * game.tileSize};
}

export const isTileExplosivable: IIsTile = (layer: Array<number>): boolean => {
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

export const isTileDestructive: IIsTile = (layer: Array<number>): boolean => {
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

export const indexOfDestructibleTile: IIndexOfDestructibleTile = (layer: Array<number>): number => {
  let index = -1
  layer.forEach((tileId, tileIndex) => {
    let tile = getTileById(tileId)
    //TODO bomba precisa não ser atravessável e precisa ser acionada pela explosão
    if (tile) {
      if (tile.explosivable) {
        index = tileIndex;
        return;
      }
    }
  })
  return index
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

interface IMakeImage {
  (sprite: string): HTMLImageElement
}

export const makeImage: IMakeImage = (sprite: string): HTMLImageElement => {
  let image = new Image()
  image.src = "../resources/images/" + sprite + ".png"
  return image
}

export const roundToFixed = (number: number, fixed: number): number => {
  return parseFloat((number).toFixed(fixed))
}

export const forCoordinates = (doOnCoordinate: IPositionFunction) => {
  for (let y = 0; y < game.scenario.length; y++) {
    for (let x = 0; x < game.scenario[y].length; x++) {
      doOnCoordinate({x: x, y: y})
    }
  }
}

export const getCoordinate = (pos: IPosition) => game.scenario[pos.y][pos.x]