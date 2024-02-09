// import { createPinia } from "pinia";
import { useGridStore } from "@/stores/grid";
// const pinia = createPinia();
const directions = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];
let GRID = [];
let source = [];
let dest = [];
let rows = 0;
let cols = 0;
let path = [];
let visitedCord = [];
let visited = [];

const callDFS = (vis) => {
  const gridStore = useGridStore();
  GRID = gridStore.matrix;
  source = gridStore.grid.source;
  dest = gridStore.grid.dest;
  rows = gridStore.rows;
  cols = gridStore.cols;
  visited = [...vis];
  dfs(source[0], source[1]);
  return {
    visitedCord,
    path,
  };
};

function isValidPosition(row, col) {
  if (
    row >= 0 &&
    col >= 0 &&
    row < rows &&
    col < cols &&
    GRID[row][col] !== 1 &&
    !visited[row][col]
  ) {
    visitedCord.push([row, col]);
    return true;
  }
  return false;
}

function dfs(row, col) {
  if (row === dest[0] && col === dest[1]) {
    path.push([row, col]);
    return true;
  }

  for (const [r, c] of directions) {
    const newRow = row + r;
    const newCol = col + c;

    if (isValidPosition(newRow, newCol)) {
      path.push([row, col]);
      visited[row][col] = true;

      if (dfs(newRow, newCol)) {
        return true;
      }
      path.pop();
    }
  }

  return false;
}

export default callDFS;
