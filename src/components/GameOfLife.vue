<script lang="ts" setup>
import { ref } from 'vue'

import Cell, { WorldContext } from '../assets/script/cell'

let isPlaying: boolean = false
let isInit: boolean = false
let framesElapsed: number = 0

let grid: Cell[] = []
let context: CanvasRenderingContext2D | null | undefined

let currentFrame: number

const display = ref<HTMLCanvasElement | undefined>()
const gridLength = ref<number>(256)
const zoom = ref<number>(4)
const throttle = ref<number>(3)

const draw = (): void => {
  grid.forEach(cell => cell.draw())
}

const init = (): void => {

  isPlaying = false
  isInit = true
  context = display.value?.getContext('2d')

  if (context && context !== null) {

    const worldContext: WorldContext = {
      renderCtx: context,
      cellSize: zoom.value,
      gridSize: gridLength.value
    }

    grid = []

    while (grid.length < Math.pow(gridLength.value, 2)) {

      const isAlive: boolean = Math.random() >= 0.5
      const color: string = isAlive ? '#00FF00' : '#000000'

      grid.push(new Cell(grid.length, isAlive, color, worldContext))
    }

    draw()
  }
}

const countLiveNeighbors = (cell: Cell): number => {

  const { value: w } = gridLength
  const { index: idx, posX, posY } = cell

  let count = 0

  // NW
  count += (posX && posY && grid[idx - w - 1].isAlive) ? 1: 0
  // N
  count += (posY && grid[idx - w].isAlive) ? 1 : 0
  // NE
  count += (posX < w - 1 && posY && grid[idx - w + 1].isAlive) ? 1 : 0
  // E
  count += (posX < w - 1 && grid[idx + 1].isAlive) ? 1 : 0
  // SE
  count += (posX < w - 1 && posY < w - 1 && grid[idx + w + 1].isAlive) ? 1 : 0
  // S
  count += (posY < w - 1 && grid[idx + w].isAlive) ? 1 : 0
  // SW
  count += (posX && posY < w - 1 && grid[idx + w - 1].isAlive) ? 1 : 0
  // W
  count += (posX && grid[idx - 1].isAlive) ? 1 : 0

  return count
}

const computeNextColor = (isAlive: boolean, wasAlive: boolean): string => {

  if (wasAlive) {

    if (isAlive) {
      // Cell lives
      return 'rgba(255, 255, 255, 0.125)'
    }

    // Cell dies
    return '#FF0000'
  }

  if (isAlive) {
    // Cell spawns
    return '#00FF00'
  }

  // Cell is dead
  return 'rgba(0, 0, 0, 0.125)'
}

const update = (): void => {

  const nextGrid: Cell[] = []

  grid.forEach((cell) => {

    const count: number = countLiveNeighbors(cell)
    const cellChanges: boolean = cell.isAlive && (count < 2 || count > 3) || !cell.isAlive && count === 3
    const isAlive: boolean = cellChanges ? !cell.isAlive : cell.isAlive
    const color: string = computeNextColor(isAlive, cell.isAlive)

    nextGrid.push(new Cell(cell.index, isAlive, color, cell.context))
  })

  grid = nextGrid

  draw()
}

const reset = (): void => {

  isPlaying = false

  window.cancelAnimationFrame(currentFrame)

  currentFrame = requestAnimationFrame(() => {
    init()
  })
}

const play = (evt?: MouseEvent): void => {

  if (evt) {

    if (!isInit) {
      init()
    }

    isPlaying = !isPlaying
  }

  if (isPlaying) {

    if (framesElapsed >= throttle.value) {
      framesElapsed = 0
      update()
    } else {
      framesElapsed += 1
    }

    currentFrame = requestAnimationFrame(() => play())
  }
}

const step = (): void => {
  isPlaying = false
  update()
}
</script>

<template>
  <canvas
    class="game-of-life"
    ref="display"
    :width="gridLength * zoom"
    :height="gridLength * zoom"
  ></canvas>

  <div class="controls">
    <label>
      <span>Grid size:</span>

      <input
        type="number"
        min="3"
        v-model="gridLength"
      />
    </label>

    <label>
      <span>Zoom:</span>

      <input
        type="number"
        min="1"
        v-model="zoom"
      />
    </label>

    <label>
      <span>Throttle:</span>

      <input
        type="number"
        min="0"
        v-model="throttle"
      />
    </label>

    <button @click="reset">RESET</button>
    <button @click="play">PLAY</button>
    <button @click="step">STEP</button>
  </div>
</template>

<style lang="scss" scoped>
.game-of-life {
  border: 1px solid #000;
  margin-bottom: 16px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
