<template>
  <div class="layer">
    <header v-mouse-drag="handleDrag">
      <div class="logo">Logo</div>
      <div class="muen">
        <div class="item" @click="handlerMinimize">
          <n-icon size="20">
            <RemoveSharp />
          </n-icon>
        </div>
        <div class="item" @click="handlerMaximize" v-if="isMax">
          <n-icon size="20">
            <ExpandSharp />
          </n-icon>
        </div>
        <div class="item" @click="handlerRestore" v-else>
          <n-icon size="20">
            <TabletLandscapeOutline />
          </n-icon>
        </div>
        <div class="item" @click="handlerClose">
          <n-icon size="20">
            <CloseSharp />
          </n-icon>
        </div>
      </div>
    </header>
    <div class="layer">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

import {
  TabletLandscapeOutline,
  CloseSharp,
  ExpandSharp,
  RemoveSharp
} from '@vicons/ionicons5'
const { ipcRenderer } = window.require('electron')
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layer',
  components: {
    RemoveSharp,
    CloseSharp,
    ExpandSharp,
    TabletLandscapeOutline
  },
  setup (props) {
    const isMax = ref(true)
    const handleDrag = (pos) => {
      ipcRenderer.send('move-main', pos)
    }
    const handlerMinimize = (e) => {
      console.log(111)
      ipcRenderer.send('mainwin-minize')
    }
    const handlerMaximize = (e) => {
      if (isMax.value) {
        isMax.value = false
        ipcRenderer.send('mainwin-maxize')
      } else {
        isMax.value = true
        ipcRenderer.send('mainwin-restore')
      }
    }
    const handlerClose = (e) => {
      ipcRenderer.send('mainwin-close')
    }
    const handlerRestore = (e) => {
      isMax.value = true

      ipcRenderer.send('mainwin-restore')
    }

    return {

      handleDrag,
      handlerMinimize,
      handlerMaximize,
      handlerClose,
      handlerRestore,
      isMax
    }
  }
})
</script>

<style scope>
.layer {
  background: #101014;
}

header {
  height: 50px;
  background: #26262a;
  color: #fff;
  display: flex;

  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
}

.muen {
  height: 100%;
  display: flex;
  align-items: center;
}

.item {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.item:hover {
  background: #111;
}

.item:nth-child(3):hover {
  background: red;
}

.layer {
  position: relative;
}
</style>
