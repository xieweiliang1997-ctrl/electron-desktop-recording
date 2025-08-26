import { VIDEO_PATH } from './constant'
const fs = window.require('fs')
const path = window.require('path')
const mkdirDirectory = (pathUrl) => {
  return new Promise((resolve) => {
    if (!fs.existsSync(pathUrl)) {
      const res = fs.mkdirSync(pathUrl, {
        recursive: true
      })
      if (res) {
        resolve(true)
      }
    } else {
      resolve(true)
    }
  })
}
export const saveVideo = (blob) => {
  // console.log('bolb')
  return new Promise((resolve, reject) => {
    const timer = new Date().getTime()

    const VideoPath = path.join(VIDEO_PATH, `${timer}.mp4`)
    mkdirDirectory(VIDEO_PATH).then(() => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      reader.onload = () => {
        const buffer = Buffer.from(reader.result)
        fs.writeFile(VideoPath, buffer, {}, (err, res) => {
          // eslint-disable-next-line no-useless-return
          if (err) return
        })
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.onloadend = () => {
        resolve()
      }
    })
  })
}

export const directoryFiles = () => {
  if (!fs.existsSync(VIDEO_PATH)) {
    return []
  }
  const filenames = fs.readdirSync(VIDEO_PATH)
  console.log(filenames)
  const files = filenames.filter(item => {
    const filePath = path.join(VIDEO_PATH, item)
    return fs.statSync(filePath).isFile()
  })
  return files
}
export const timeFormat = (time) => {
  const h = Math.floor(time / 3600) < 10 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600)
  const m = Math.floor((time / 60) % 60) < 10 ? '0' + Math.floor((time / 60) % 60) : Math.floor((time / 60) % 60)
  const s = Math.floor(time % 60) < 10 ? '0' + Math.floor(time % 60) : Math.floor(time % 60)

  return `${h}:${m}:${s}`
}
