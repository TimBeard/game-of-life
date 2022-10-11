export default class Cell {

  static width: number = 12
  static height: number = 12

  ctx: CanvasRenderingContext2D

  x: number
  y: number

  alive: boolean

  constructor (ctx: CanvasRenderingContext2D, x: number, y: number) {

    this.ctx = ctx

    this.x = x
    this.y = y

    this.alive = Math.random() >= 0.5
  }

  draw() {
    this.ctx.fillStyle = this.alive ? '#000000' : '#FFFFFF'
    this.ctx.fillRect(this.x * Cell.width, this.y * Cell.height, Cell.width, Cell.height)
  }
}
