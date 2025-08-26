<template>
  <div class="btnBox">
    <div>
      <div class="btn" @click="sourceStart">
        {{ isRecord ? '结束录制' : '录屏' }}
      </div>

      <div class="timer">{{ timeFormat(timestamp) }}</div>
    </div>
  </div>
</template>

<script >
import { defineComponent, h, toRefs } from 'vue'
import { timeFormat } from '../../utils/helper'
import RecordList from '../Layer/RecordList.vue'
import { useDialog } from 'naive-ui'
export default defineComponent({
  name: 'start-btn',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RecordList
  },
  props: {
    timestamp: {
      type: String
    },
    sourceList: {
      type: Array
    },
    isRecord: {
      type: Boolean
    }
  },
  emits: ['sourceStart', 'recrodWin'],
  setup (props, { emit }) {
    const dialog = useDialog()
    const { sourceList: list, isRecord } = toRefs(props)
    const recrodWin = (item, flag) => {
      emit('recrodWin', item)
      flag && dialog.destroyAll()
    }
    const sourceStart = () => {
      emit('sourceStart')
      console.log(isRecord.value)

      !isRecord.value && dialog.warning({
        title: '选择对应桌面',
        content: () => h(RecordList, {
          sourceList: list,
          onrecrodWin: recrodWin
        })
      })
    }
    return {
      timeFormat,
      sourceStart
    }
  }
})
</script>

<style scoped>
.btnBox {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  cursor: pointer;
  background: red;
  width: 8vh;
  height: 8vh;
  border-radius: 50%;
  text-align: center;
  line-height: 8vh;
  color: #fff;
  font-weight: bold;
}
</style>
