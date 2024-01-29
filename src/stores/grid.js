import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', () => {
  const count = ref(0)
  const grid = reactive({
    source: [10,10],
    dest: [10,20],
    matrix: []
  })
  const doubleCount = computed(() => count.value * 2)
  function buildMatrix(rows, cols) {
    grid.matrix = new Array(rows).fill(0).map(() => new Array(cols).fill(0))
  }

  function updateCoordinates(cord, pos) {
    const [r,c] = cord
    if (pos === 'source') {
      grid.source[0] = r
      grid.source[1] = c
    }
    if (pos === 'dest') {
      grid.dest[0] = r
      grid.dest[1] = c
    }
    console.log('safsf')

  }

  return { grid, updateCoordinates, buildMatrix }
})
