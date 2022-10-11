<script lang="ts" setup>
import { type Ref, ref, onUpdated } from 'vue';

interface cell {
  state: boolean
  color: string
  draw: boolean
}

let ctx: CanvasRenderingContext2D | null | undefined

let grid: cell[] = []
let isPlaying: Boolean = false

const display: Ref<HTMLCanvasElement | undefined> = ref()
const gridLength: Ref<number> = ref(192)


const init = (evt: MouseEvent | null, play: Boolean = false): void => {

  console.log('init')

  grid = []
  ctx = display.value?.getContext('2d')
  isPlaying = play

  while (grid.length < Math.pow(gridLength.value, 2)) {

    const state = Math.random() <= 0.5
      ? { state: false, color: '#000000', draw: false }
      : { state: true, color: '#00FF00', draw: false }

      grid.push(state)
  }
}

const update = (): void => {

  console.log('update')

  const nextGrid: cell[] = []

  grid.forEach((cell, cellIndex) => {

    let count = 0

    count += grid[cellIndex - gridLength.value]?.state ? 1 : 0
    count += grid[cellIndex - gridLength.value - 1]?.state ? 1 : 0
    count += grid[cellIndex - gridLength.value + 1]?.state ? 1 : 0

    count += grid[cellIndex + 1]?.state ? 1 : 0

    count += grid[cellIndex + gridLength.value]?.state ? 1 : 0
    count += grid[cellIndex + gridLength.value - 1]?.state ? 1 : 0
    count += grid[cellIndex + gridLength.value + 1]?.state ? 1 : 0

    count += grid[cellIndex - 1]?.state ? 1 : 0

    if (cell.state && (count < 2 || count > 3)) {
      nextGrid[cellIndex] = { state: false, color: '#FF0000', draw: true }
    } else if (!cell.state && count === 3) {
      nextGrid[cellIndex] = { state: true, color: '#00FF00', draw: true }
    } else {
      if (cell.state) {
        nextGrid[cellIndex] = { ...cell, color: 'rgba(255, 255, 255, 0.125)' }
      } else {
        nextGrid[cellIndex] = { ...cell, draw: false }
      }
    }
  })

  grid = nextGrid
}

let countDown = 0

const draw = (play: boolean = true): void => {

  console.log('draw')

  if (countDown === 3 || !play) {

    countDown = 0

    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.125)'
      ctx.fillRect(0, 0, gridLength.value * 5, gridLength.value * 5)
    }

    grid.forEach((cell, cellIndex) => {

      if (cell.draw) {

        const pxX: number = cellIndex % gridLength.value
        const pxY: number = cellIndex < gridLength.value
          ? 0
          : Math.floor(cellIndex / gridLength.value)

        if (ctx) {
          ctx.fillStyle = cell.color
          ctx.fillRect(pxX * 5, pxY * 5, 1 * 5, 1 * 5)
        }
      }
    })

    update()
  } else {
    countDown += 1
  }

  if (isPlaying) {
    requestAnimationFrame(() => draw(true))
  }
}

const startStop = (): void => {

  isPlaying = !isPlaying

  if (isPlaying) {

    if (!grid.length) {
      init(null, true)
    }

    requestAnimationFrame(() => draw(true))
  }
}

const step = (): void => {
  isPlaying = false
  requestAnimationFrame(() => draw(false))
}
</script>

<template>
  <canvas
    class="game-of-life"
    ref="display"
    :width="gridLength * 5"
    :height="gridLength * 5"
  ></canvas>

  <div class="controls">
    <input
      type="number"
      min="0"
      max="512"
      v-model="gridLength"
    />

    <button @click="init">INIT / RESET</button>
    <button @click="startStop">START / PAUSE</button>
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
