import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const useGridStore = defineStore("grid", () => {
  const grid = reactive({
    source: [10, 10],
    dest: [10, 20],
    // matrix: [],
  });
  let rows = ref(0);
  let cols = ref(0);

  let matrix = reactive([]);

  function buildMatrix(r, c) {
    // grid.matrix = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    rows.value = r;
    cols.value = c;
    const arr = new Array(rows.value)
      .fill(0)
      .map(() => new Array(cols.value).fill(0));
    matrix.push(...arr);
  }

  function updateCoordinates(cord, pos) {
    const [r, c] = cord;
    if (pos === "source") {
      grid.source[0] = r;
      grid.source[1] = c;
    }
    if (pos === "dest") {
      grid.dest[0] = r;
      grid.dest[1] = c;
    }
    console.log("safsf");
  }

  return { grid, matrix, updateCoordinates, buildMatrix, rows, cols };
});
