import times from "./times.js";

class AnimObject implements IAnim {
  public frame: number;
  public anim: boolean
  public image: HTMLImageElement
  public images: Array<HTMLImageElement>
  public maxFrames: number;

  private animationInterval = 0

  constructor(folder: string, maxFrames: number, anim: boolean) {
    this.frame = 0
    this.maxFrames = maxFrames

    if (maxFrames === 0) {
      let image = new Image()
      image.src = "../resources/images/" + folder + ".png"
      this.image = image
    } else {
      let images: Array<HTMLImageElement> = []
      for (let i = 0; i < maxFrames; i++) {
        let image = new Image()
        image.src = "../resources/animations/" + folder + "/" + i + ".png"
        images.push(image)
      }
      this.image = images[0]
      this.images = images
    }

    if (anim) {
      this.startAnimation()
    }
  }

  public startAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.frame === this.maxFrames - 1) {
        this.frame = 0
      } else {
        this.frame++
      }
      this.image = this.images[this.frame]
    }, times.gameObjectAnim)
  }

  public stopAnimation() {
    clearInterval(this.animationInterval)
  }

}

export default AnimObject