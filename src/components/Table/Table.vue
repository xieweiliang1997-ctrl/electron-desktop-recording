<template>
  <n-data-table
  :columns="columns"
  :data="data"
  :pagination="pagination"
  :bordered="false"
  :max-height="400"
  />
</template>

<script >
import { watch, defineComponent, h, ref, toRefs } from 'vue'
import { NButton, NTime } from 'naive-ui'

const createColumns = ({
  play,
  openDir
}) => {
  return [
    {
      title: 'No',
      key: 'no'
    },
    {
      title: 'Title',
      key: 'title'
    },
    {
      title: 'Dir',
      key: 'dir',
      render (row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => openDir(row)
          },
          { default: () => '文件夹' }
        )
      }
    },
    {
      title: 'Length',
      key: 'length',
      render (row) {
        return h(NTime, {
          time: new Date(Number(row.length))
        })
      }
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => play(row)
          },
          { default: () => 'Play' }
        )
      }
    }
  ]
}

export default defineComponent({
  name: 'x-table',
  component: {
    NTime
  },
  props: {
    files: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  emits: ['handlerPlay', 'openDir'],
  setup (props, { emit }) {
    const { files } = toRefs(props)
    const data = ref(files.value.map((item, index) => {
      const length = item.split('.')[0]
      return { no: index + 1, title: item, length }
    }))
    watch(files, (val) => {
      data.value = val.map((item, index) => {
        const length = item.split('.')[0]
        return { no: index + 1, title: item, length }
      })
    })
    return {
      data,
      columns: createColumns({
        play (row) {
          console.log(row)
          emit('handlerPlay', row.title)
          // message.info(`Play ${row.title}`)
        },
        openDir (row) {
          emit('openDir', row.title)
        }
      }),
      pagination: { pageSize: 10 }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
