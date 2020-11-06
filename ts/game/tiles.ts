const tiles: ITile = {
  ground :{
    id: 0,
    sprite: 'grass',
    physics: false,
    explosivable: false,
    isPlayer: false,
    isEnemy: false,
  },
  player: {
    id: 1,
    sprite: 'player',
    physics: false,
    explosivable: false,
    isPlayer: true,
    isEnemy: false,
  },
  wall: {
    id: 2,
    sprite: 'wall',
    physics: true,
    explosivable: false,
    isPlayer: false,
    isEnemy: false,
  },
  box: {
    id: 3,
    sprite: 'box',
    physics: true,
    explosivable: true,
    isPlayer: false,
    isEnemy: false,
  },
  bomb: {
    id: 4,
    sprite: 'bomb',
    physics: true,
    explosivable: false,
    isPlayer: false,
    isEnemy: false,
  },
  explosion: {
    id: 5,
    sprite: 'explosion',
    physics: false,
    explosivable: false,
    isPlayer: false,
    isEnemy: false,
  },
  enemySimpleMove: {
    id: 6,
    sprite: 'enemy',
    physics: false,
    explosivable: false,
    isPlayer: false,
    isEnemy: true,
  },
  enemyNestedMove: {
    id: 7,
    sprite: 'enemy',
    physics: false,
    explosivable: false,
    isPlayer: false,
    isEnemy: true
  }
}

export default tiles