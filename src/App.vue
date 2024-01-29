<script setup>
import { reactive, ref, onMounted } from "vue";
import { useGridStore } from "@/stores/grid";
const gridStore = useGridStore();
const width = window.innerWidth;
const height = window.innerHeight - 53;
const cell_width = 20;
const cell_height = 20;

const cols = Math.floor(width / cell_width);
const rows = Math.floor(height / cell_height);

gridStore.buildMatrix(rows, cols);
// console.log(grid.)
const GRID = reactive(gridStore.grid.matrix);
const source = reactive(gridStore.grid.source);
const dest = reactive(gridStore.grid.dest);
const gridContainer = ref(null);
let pos1;

onMounted(() => {
  // console.log(gridContainer.value);
});

function startDrag(event, r) {
  console.log(r);
  pos1 = r;
}

function onDrop(event, cord, pos) {
  // console.log(r, c);
  // source[0] = r;
  // source[1] = c;
  console.log(pos1);
  const [r, c] = cord;
  gridStore.updateCoordinates(cord, pos1);
  if (pos1 === "source") {
    source[0] = r;
    source[1] = c;
  }
  if (pos1 === "dest") {
    dest[0] = r;
    dest[1] = c;
  }
}

// color change

function changeColor(r, c) {
  return new Promise((res) => {
    setTimeout(() => {
      res({ row: r, col: c });
    }, 0);
  });
}

const directions = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

// const visited = new Array(GRID.length)
//   .fill(0)
//   .map(() => new Array(GRID[0].length).fill(false));

const visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
// console.log(visited);
let path = [];
let flag = false;

function isValidPosition(row, col) {
  if (
    row >= 0 &&
    col >= 0 &&
    row < rows &&
    col < cols &&
    GRID[row][col] !== 1 &&
    !visited[row][col]
  ) {
    // console.log(gridContainer.value[row].children[col]);
    gridContainer.value[row].children[col].classList.add("visited_cell");
    return true;
  }
  return false;
  // return (
  //   row >= 0 &&
  //   col >= 0 &&
  //   row < rows &&
  //   col < cols &&
  //   GRID[row][col] !== 1 &&
  //   !visited[row][col]
  // );
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async function dfs(row, col) {
//   if (row === dest[0] && col === dest[1]) {
//     // Reached the target
//     path.push([row, col]);
//     return true;
//   }

//   for (const [r, c] of directions) {
//     const newRow = row + r;
//     const newCol = col + c;

//     if (isValidPosition(newRow, newCol)) {
//       path.push([row, col]); // Add the current position to the path
//       // gridContainer.value[row].children[col].classList.add("visited_cell");
//       visited[row][col] = true;

//       await delay(5); // Simulate delay for visualization

//       if (await dfs(newRow, newCol)) {
//         return true;
//       }
//       path.pop(); // Backtrack if the current direction didn't lead to the target
//     }
//   }

//   return false;
// }
function dfs(row, col) {
  return new Promise((resolve) => {
    if (row === dest[0] && col === dest[1]) {
      // Reached the target
      path.push([row, col]);
      resolve(true);
    } else {
      let found = false;

      const checkDirections = async () => {
        for (const [r, c] of directions) {
          const newRow = row + r;
          const newCol = col + c;

          if (isValidPosition(newRow, newCol)) {
            path.push([newRow, newCol]); // Add the current position to the path
            visited[newRow][newCol] = true;

            // Simulate delay for visualization
            await delay(15);

            found = await dfs(newRow, newCol);
            if (found) {
              break; // Stop further iteration if the target is reached
            } else {
              path.pop(); // Backtrack if the current direction didn't lead to the target
            }
          }
        }

        resolve(found);
      };

      checkDirections();
    }
  });
}

// Helper function for delay
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

function visualizeShortestPath(shortestPathNodesInOrder) {
  for (let i = 0; i < shortestPathNodesInOrder.length; i++) {
    // console.log("before timeout");
    setTimeout(() => {
      const node = shortestPathNodesInOrder[i];
      // document
      //   .getElementById(`node-${node.row}-${node.col}`)
      //   .classList.add("short");
      console.log("node", gridContainer.value[node[0]].children[node[1]]);
      gridContainer.value[node[0]].children[node[1]].classList.remove(
        "visited_cell"
      );
      gridContainer.value[node[0]].children[node[1]].classList.add("short");
    }, 20 * i);
  }
}
const startAlgo = async (row, col) => {
  await dfs(row, col);

  console.log(path);
  visualizeShortestPath(path.reverse());
  return path.reverse();
};
</script>
<template>
  <h1 class="text-lg text-center">Pathfinding Visualizer</h1>
  <div class="text-red-800" @click="startAlgo(source[0], source[1])">
    sfsfsaf
  </div>
  <div
    v-for="(row, r_ind) in gridStore.grid.matrix"
    :key="row"
    class="flex h-[20px]"
    ref="gridContainer"
  >
    <div
      v-for="(col, c_ind) in row"
      :key="col"
      class="w-[20px] border-2 border-red-400"
      @drop="onDrop($event, [r_ind, c_ind], 'source')"
      @dragover.prevent
    >
      <div
        v-if="r_ind === source[0] && c_ind === source[1]"
        class="bg-black w-full h-full cursor-pointer"
        draggable
        ref="source"
        @dragstart="startDrag($event, 'source')"
      ></div>
      <div
        v-if="r_ind === dest[0] && c_ind === dest[1]"
        class="bg-green-500 w-full h-full cursor-pointer"
        draggable
        ref="dest"
        @dragstart="startDrag($event, 'dest')"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.visited_cell {
  background-color: rgba(0, 255, 255, 0.744);
  animation-name: example;
  animation-duration: 1s;
}
.short {
  background-color: rgb(255, 0, 251);
}

@keyframes example {
  from {
    scale: 0;
    background-color: rgb(225, 0, 255);
  }
  to {
    scale: 1;
    background-color: rgb(127, 255, 148);
  }
}
</style>
