import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const events = require('events')
const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  resizeble: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
}
class Launch extends events {
  constructor (conInfo) {
    super()
    this.confInfo = conInfo
    this.conf = Object.assign({}, winConfig, conInfo)
    this.windowInstance = new BrowserWindow(this.conf)

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/luanch`)
    } else {
      createProtocol('app')
      this.windowInstance.loadURL('file://' + __dirname + '/index.html/#/luanch')
    }
    this.init()
  }

  init () {
    this.windowInstance.once('ready-to-show', () => {
      this.windowInstance.show()
    })
    this.windowInstance.on('show', () => {
      this.emit('show')
    })
  }

  close () {
    if (this.windowInstance && this.windowInstance.isVisible) {
      this.windowInstance.close()
      this.windowInstance = null
    }
  }
}

export default Launch
