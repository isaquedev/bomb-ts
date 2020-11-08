import tiles from "../game/tiles.js";
import AnimObject from "../utils/anim.js";
import times from "../utils/times.js";

class Bomb extends AnimObject implements IBomb {

  public id: number;
  public x: number;
  public y: number;
  public power: number;
  public timeOut: number;

  constructor(id: number, x:number, y:number, power: number, timeOut: number) {
    super(tiles.bomb.sprite, tiles.bomb.frames)
    this.id = id
    this.x = x
    this.y = y
    this.power = power
    this.timeOut = timeOut
  }

}

export default Bomb