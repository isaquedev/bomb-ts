import times from "./times.js";

class AnimObject implements IAnim {
  public frame: number;
  public image: HTMLImageElement
  public images: Array<HTMLImageElement>
  public maxFrames: number;

  constructor(folder: string, maxFrames: number) {
    this.frame = 0
    this.maxFrames = maxFrames
    let images: Array<HTMLImageElement> = []
    for (let i = 0; i < maxFrames; i++) {
      let image = new Image()
      image.src = "../resources/animations/" + folder + "/" + i + ".png"
      images.push(image)
    }
    this.image = images[0]
    this.images = images
    setInterval(() => {
      if (this.frame === this.maxFrames - 1) {
        this.frame = 0
      } else {
        this.frame++
      }
      this.image = this.images[this.frame]
    }, times.gameUpdate * 5)
  }

}

export default AnimObject