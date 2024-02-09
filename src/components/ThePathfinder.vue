<script setup>
import { reactive, ref, onMounted } from "vue";
import TheNode from "./TheNode.vue";
import { useGridStore } from "@/stores/grid";
import callDFS from "../algorithms/dfs.js";
const gridStore = useGridStore();
const width = window.innerWidth;
const height = window.innerHeight - 53;
const cell_width = 20;
const cell_height = 20;

const cols = Math.floor(width / cell_width);
const rows = Math.floor(height / cell_height);

gridStore.buildMatrix(rows, cols);
// console.log(grid.)
const GRID = reactive(gridStore.matrix);
const source = reactive(gridStore.grid.source);
const dest = reactive(gridStore.grid.dest);
const gridContainer = ref(null);
let pos1;

onMounted(() => {
  // console.log(gridContainer.value);
});

// const getNode = (r, c) => {
//   if (source[0] === r && source[1] === c) {
//     return "source";
//   }
//   if (dest[0] === r && dest[1] === c) {
//     return "target";
//   }
// };

// const mousedown = (evt) => {
//   console.log(evt.target.draggable);
// };

// function startDrag(evt) {
//   console.log(evt);

//   const node = evt.target.dataset.node;
//   if (node !== "source" || node !== "target") return;
//   evt.target.setAttribute("draggable", true);
// }

// function onDrop(event, cord) {
//   console.log(pos1);
//   const [r, c] = cord;
//   gridStore.updateCoordinates(cord, pos1);
//   if (pos1 === "source") {
//     source[0] = r;
//     source[1] = c;
//   }
//   if (pos1 === "dest") {
//     dest[0] = r;
//     dest[1] = c;
//   }
// }

const handleDrop = (cord) => {
  gridStore.updateCoordinates(cord);
};

const visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
let path = [];
let visitedCord = [];

// function isValidPosition(row, col) {
//   if (
//     row >= 0 &&
//     col >= 0 &&
//     row < rows &&
//     col < cols &&
//     GRID[row][col] !== 1 &&
//     !visited[row][col]
//   ) {
//     visitedCord.push([row, col]);
//     return true;
//   }
//   return false;
// }
// function dfs(row, col) {
//   if (row === dest[0] && col === dest[1]) {
//     path.push([row, col]);
//     return true;
//   }

//   for (const [r, c] of directions) {
//     const newRow = row + r;
//     const newCol = col + c;

//     if (isValidPosition(newRow, newCol)) {
//       path.push([row, col]);
//       visited[row][col] = true;

//       if (dfs(newRow, newCol)) {
//         return true;
//       }
//       path.pop();
//     }
//   }

//   return false;
// }

function visualizeShortestPath(shortestPathNodesInOrder) {
  for (let i = 0; i < shortestPathNodesInOrder.length; i++) {
    setTimeout(() => {
      const node = shortestPathNodesInOrder[i];
      gridContainer.value[node[0]].children[node[1]].classList.remove(
        "visited_cell"
      );
      gridContainer.value[node[0]].children[node[1]].classList.add("short");
      gridContainer.value[node[0]].children[node[1]].classList.add(
        "white_border"
      );
    }, 20 * i);
  }
}

const visualizeAlgo = () => {
  for (let i = 0; i < visitedCord.length; i++) {
    if (i === visitedCord.length - 1) {
      setTimeout(() => {
        visualizeShortestPath(path);
      }, 22 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedCord[i];
      gridContainer.value[node[0]].children[node[1]].classList.add(
        "visited_cell"
      );
      gridContainer.value[node[0]].children[node[1]].classList.add(
        "white_border"
      );
    }, 22 * i);
  }
};
const startAlgo = () => {
  const { visitedCord: v, path: p } = callDFS([...visited]);
  visitedCord = v;
  path = p;
  //   dfs(row, col);
  visualizeAlgo();
};
</script>

<template>
  <div>
    <h1 class="text-lg text-center">Pathfinding Vuesualizer</h1>
    <div class="text-red-800" @click="startAlgo()">Animate</div>
    <div
      v-for="(row, r_ind) in gridStore.matrix"
      :key="row"
      class="flex h-[20px]"
      ref="gridContainer"
    >
      <!-- <div
        v-for="(col, c_ind) in row"
        :key="col"
        class="w-[20px] border-t-[1px] border-l-[1px] border-blue-300"
        :data-row-cell="r_ind + '-' + c_ind"
        :data-node="getNode(r_ind, c_ind)"
        :class="[
          {
            'border-b-[1px]': r_ind >= gridStore.matrix.length - 1,
            'border-r-[1px]': c_ind >= gridStore.matrix[0].length - 1,
          },
          {
            'bg-black cursor-pointer':
              r_ind === source[0] && c_ind === source[1],
            'bg-red-500 cursor-pointer': r_ind === dest[0] && c_ind === dest[1],
          },
        ]"
        :draggable="
          getNode(r_ind, c_ind) === 'source' ||
          getNode(r_ind, c_ind) === 'target'
            ? true
            : false
        "
        @dragstart="startDrag"
        @drop="onDrop($event, [r_ind, c_ind])"
        @dragover.prevent
        @mousedown="mousedown"
      >
      </div> -->
      <TheNode
        v-for="(col, c_ind) in row"
        :key="col"
        :node="[r_ind, c_ind]"
        :isSource="r_ind === source[0] && c_ind === source[1]"
        :isTarget="r_ind === dest[0] && c_ind === dest[1]"
        :sourceNode="source"
        :targetNode="dest"
        @custom-drop="handleDrop(cord)"
      />
    </div>
  </div>
</template>

<style scoped>
.visited_cell {
  background-color: rgba(0, 255, 255, 0.744);
  animation-name: visitedAnimation;
  animation-duration: 1.3s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-fill-mode: forwards;
}

.white_border {
  border: 1.3px solid white;
  /* animation-name: visitedAnimation;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-fill-mode: forwards; */
}
.short {
  background-color: rgba(81, 255, 12, 0.959);
  animation-name: shortestAnimation;
  animation-duration: 1.3s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-fill-mode: forwards;
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

@keyframes visitedAnimation {
  0% {
    transform: scale(0.3);
    background-color: rgba(0, 0, 66, 0.75);
    border-radius: 100%;
  }

  50% {
    background-color: rgba(17, 104, 217, 0.75);
  }

  75% {
    transform: scale(1.3);
    background-color: rgba(0, 217, 159, 0.75);
  }

  100% {
    transform: scale(1);
    background-color: rgba(0, 190, 218, 0.75);
  }
}
@keyframes shortestAnimation {
  0% {
    transform: scale(0.3);
    background-color: rgb(235, 165, 35);
    border-radius: 100%;
  }

  50% {
    background-color: rgb(235, 215, 35);
  }

  75% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
