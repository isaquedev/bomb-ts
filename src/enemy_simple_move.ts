interface IEnemySimpleMove {
  object: ILiveObject;
}

const enemySimpleMove: IEnemySimpleMove = {
  object: {
    params: {
      hp: 1,
      dead: false,
      isInvulnerable: false,
      position: {x: 0, y: 0}
    },
    methods: {
      start: () => {

      },
      update: () => {

      },
      move: () => {

      },
      damage: () => {
        
      }
    }
  }
}

export default enemySimpleMove

