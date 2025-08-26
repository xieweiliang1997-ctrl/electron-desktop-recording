<template>
  <div class="suspend-page" v-mouse-drag="handleDrag">
    <div class="ball" ref="ballRef">{{transTime(timestamp)}}</div>
  </div>
</template>
<script>
import { ref, defineComponent } from 'vue'
import { timeFormat } from '@/utils/helper'
const { ipcRenderer } = window.require('electron')
export default defineComponent({
  name: 'suspendPage',
  setup () {
    const timer = ref(null)
    const timestamp = ref(0)
    const isRecord = ref(false)
    const countDown = () => {
      timestamp.value++
      timer.value = setTimeout(() => {
        countDown()
      }, 1000)
    }
    const transTime = (time) => {
      return timeFormat(time)
    }
    const startCount = () => {
      if (!isRecord.value) {
        isRecord.value = true
        countDown()
      }
    }
    ipcRenderer.on('record-start', () => {
      startCount()
    })
    ipcRenderer.on('record-stop', () => {
      timer.value && clearTimeout(timer.value)
      timestamp.value = 0
      isRecord.value = false
    })
    const handleDrag = (pos) => {
      ipcRenderer.send('ball-move', pos)
    }
    return {
      handleDrag,
      timestamp,
      transTime
    }
  }
})
</script>
<style  scoped>
html,body{
  border-radius:50%;

}
.suspend-page{
  user-select: none;
  position: relative;
  height: 100vh;
  width: 100vw;
  padding:3px;
  box-sizing: border-box;

  background: transparent;
  overflow: hidden;

}
  .ball{
    background:skyblue;
    box-sizing: border-box;
    height: 100%;
    border-radius: 50%;
    border:solid 2px #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
</style>
