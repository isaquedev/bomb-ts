import tiles from "../game/tiles.js";
import AnimObject from "../utils/anim.js";

class Explosion extends AnimObject implements IExplosion {

  public position: IPosition;

  constructor(position: IPosition) {
    super(tiles.explosion.sprite, tiles.explosion.frames, true)
    this.position = position
  }

}

export default Explosion