<template>
  <div class="box">
    <n-scrollbar style="max-height: 600px">
      <div class="imgBox" :key="item.name" v-for="item in list">
        <img @click="handlerClick(item)" :src="item.url" />
      </div>
    </n-scrollbar>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue'
export default defineComponent({
  props: {
    sourceList: {
      type: Array
    }
  },
  name: 'RecordList',
  emits: ['recrodWin'],
  setup (props, { attrs }) {
    const { sourceList: list } = toRefs(props)

    const handlerClick = (item) => {
      attrs.onrecrodWin(item, true)
    }

    return {
      list,
      handlerClick
    }
  }
})
</script>
<style></style>
