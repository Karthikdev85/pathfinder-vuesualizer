<script setup>
import { ref } from "vue";
import { useGridStore } from "@/stores/grid";
const gridStore = useGridStore();
const props = defineProps({
  node: {
    type: Array,
    default: () => [0, 0],
  },
  isSource: {
    type: Boolean,
    default: false,
  },
  isTarget: {
    type: Boolean,
    default: false,
  },
  sourceNode: {
    default: () => [],
  },
  targetNode: {
    default: () => [],
  },
});

const [r_ind, c_ind] = [ref(props.node[0]), ref(props.node[1])];
// r_ind.value = node[0];
// c_ind.value = node[1];

const getNode = (r, c) => {
  if (props.sourceNode[0] === r && props.sourceNode[1] === c) {
    return "source";
  }
  if (props.targetNode[0] === r && props.targetNode[1] === c) {
    return "target";
  }
};

const emit = defineEmits(["customDrop"]);
const mousedown = (evt) => {
  console.log(evt.target.draggable);
};

function startDrag(evt) {
  console.log(evt);

  const node = evt.target.dataset.node;
  if (node !== "source" || node !== "target") return;
  evt.target.setAttribute("draggable", true);
}

function onDrop(event, cord) {
  console.log(pos1);
  const [r, c] = cord;
  gridStore.updateCoordinates(cord, pos1);
  emit("customDrop", cord);
  //   if (pos1 === "source") {
  //     sourceNode[0] = r;
  //     sourceNode[1] = c;
  //   }
  //   if (pos1 === "dest") {
  //     targetNode[0] = r;
  //     targetNode[1] = c;
  //   }
}
</script>

<template>
  <div
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
          r_ind === sourceNode[0] && c_ind === sourceNode[1],
        'bg-red-500 cursor-pointer':
          r_ind === targetNode[0] && c_ind === targetNode[1],
      },
    ]"
    :draggable="
      getNode(r_ind, c_ind) === 'source' || getNode(r_ind, c_ind) === 'target'
        ? true
        : false
    "
    @dragstart="startDrag"
    @drop="onDrop($event, [r_ind, c_ind])"
    @dragover.prevent
    @mousedown="mousedown"
  >
    <!-- <div
          v-if="r_ind === source[0] && c_ind === source[1]"
          class="bg-black w-full h-full cursor-pointer"
          ref="source"
          
          draggable="true"
        ></div>
        <div
          v-if="r_ind === dest[0] && c_ind === dest[1]"
          class="bg-red-500 w-full h-full cursor-pointer"
          ref="dest"
          @dragstart="startDrag($event, 'dest')"
          draggable="true"
        ></div> -->
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
