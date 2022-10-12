const { random: rand, floor } = Math

export interface WorldContext {
  renderCtx: CanvasRenderingContext2D
  cellSize: number
  gridSize: number
}

export default class Cell {

  index: number
  isAlive: boolean
  color: string
  context: WorldContext

  constructor (index: number, isAlive: boolean, color: string, context: WorldContext) {

    this.index = index
    this.context = context

    this.isAlive = isAlive
    this.color = color
  }

  get posX(): number {
    return this.index % this.context.gridSize
  }

  get posY(): number {
    return floor(this.index / this.context.gridSize)
  }

  draw(): void {

    const { renderCtx, cellSize } = this.context

    renderCtx.fillStyle = this.color
    renderCtx.fillRect(this.posX * cellSize, this.posY * cellSize, cellSize, cellSize)
  }
}
