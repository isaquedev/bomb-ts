const tilesConfig: ITileConfig = {
  tileSize: 48,
  tiles: {
    ground :{
      id: 0,
      name: 'ground',
      color: 'black',
      size: 48,
      physics: false,
      explosivable: false,
    },
    player: {
      id: 1,
      name: 'player',
      color: 'blue',
      size: 30,
      physics: false,
      explosivable: false
    },
    wall: {
      id: 2,
      name: 'wall',
      color: 'purple',
      size: 48,
      physics: true,
      explosivable: false
    },
    box: {
      id: 3,
      name: 'box',
      color: 'grey',
      size: 36,
      physics: true,
      explosivable: true
    },
    bomb: {
      id: 4,
      name: 'bomb',
      color: 'yellow',
      size: 40,
      physics: true,
      explosivable: false
    },
    explosion: {
      id: 5,
      name: 'explosion',
      color: 'orange',
      size: 40,
      physics: false,
      explosivable: false
    }
  }
}

export default tilesConfig