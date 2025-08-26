<template>
  <Layer>
    <n-grid>
      <n-gi span="10">
        <div class="content">
          <n-dialog-provider>
            <start-btn @sourceStart="sourceStart" @recrodWin="recrodWin" :sourceList="sourceList" :timestamp="timestamp"
              :isRecord="isRecord" />
          </n-dialog-provider>
          <div class="videoList">
            <x-table @handlerPlay="handlerPlay" @openDir="openDir" :files="files" />
          </div>
        </div>

      </n-gi>
      <n-gi span="14">
        <div class="media">
          <img :src="previewImg" v-if="videoUrl === ''" />
          <video controls autoplay :src="`http://localhost:9000/${videoUrl}`" v-else></video>
        </div>
      </n-gi>
    </n-grid>
  </Layer>
</template>

<script >
import Layer from '../components/Layer/Layer.vue'

import { ref, defineComponent } from 'vue'
import { saveVideo, directoryFiles, timeFormat } from '../utils/helper'

import XTable from '@/components/Table'
import StartBtn from '../components/StartBtn/StartBtn.vue'

const { ipcRenderer } = window.require('electron')

const getSource = () => {
  return new Promise((resolve) => {
    ipcRenderer.send('resolve-desktop')

    ipcRenderer.on('reply-sorce', (event, data) => {
      resolve(data)
    })
  })
}
export default defineComponent({
  components: {
    Layer,

    XTable,
    StartBtn

  },
  setup () {
    const previewImg = ref('')

    const isRecord = ref(false)
    const recorder = ref(null)
    const files = ref([])
    const timer = ref(null)
    const timestamp = ref(0)
    const sourceList = ref([])
    const sourceId = ref(null)

    const countDown = () => {
      timestamp.value++
      timer.value = setTimeout(() => {
        countDown()
      }, 1000)
    }
    files.value = directoryFiles()
    const getPreview = async () => {
      const source = await getSource()

      previewImg.value = source[0].thumbnail.toDataURL()
    }

    const recordStart = (stream) => {
      countDown()
      isRecord.value = true
      const blobSlice = []
      recorder.value = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })

      if (recorder.value) {
        recorder.value.start(1000)
        recorder.value.ondataavailable = (event) => {
          blobSlice.push(event.data)
        }
        recorder.value.onstop = async (event) => {
          isRecord.value = false
          const blob = new Blob([...blobSlice], {
            type: 'video/webm'
          })

          saveVideo(blob).then(() => {
            alert('保存成功')
            files.value = directoryFiles()
          })
        }
        recorder.value.onerror = (err) => {
          console.log(err)
        }
      }
    }
    const sourceStart = async () => {
      const source = await getSource()

      sourceList.value = source.map((item) => {
        return {
          url: item.thumbnail.toDataURL(),
          id: item.id
        }
      })

      if (isRecord.value) {
        ipcRenderer.send('stopRecord')
      }
    }
    ipcRenderer.on('record-stop', () => {
      timer.value && clearTimeout(timer.value)
      timestamp.value = 0
      recorder.value && recorder.value.stop()
    })
    ipcRenderer.on('record-start', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId.value,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      })
      console.log('record-start')
      recordStart(stream)
    })
    const videoUrl = ref('')
    const handlerPlay = (item) => {
      console.log(item)
      videoUrl.value = item
    }
    const openDir = (item) => {
      ipcRenderer.send('directory-open', item)
    }

    const recrodWin = (item) => {
      sourceId.value = item.id
      if (!isRecord.value) {
        ipcRenderer.send('startRecord')
      }
    }
    getPreview()

    return {
      previewImg,
      recordStart,
      sourceStart,
      isRecord,
      files,
      timestamp,
      timeFormat,
      handlerPlay,
      videoUrl,
      openDir,
      sourceList,
      recrodWin
    }
  }
})
</script>

<style scope lang="scss">
.videoList {
  height: calc(80vh - 50px);
  padding: 15px;
  box-sizing: border-box;
}

.media {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  width: 100%;
  background: #ccc;
  background-size: cover;
}

video {
  width: 100%;
  background: #ccc;
  background-size: cover;
}
</style>
