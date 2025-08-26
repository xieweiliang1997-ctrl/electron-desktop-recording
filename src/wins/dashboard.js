import { app, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const events = require('events')
const winConfig = {
  title: '录屏客户端',
  show: false,
  frame: false,
  focusable: true,
  resizeble: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
}
class Dashboard extends events {
  constructor (conInfo) {
    super()
    this.confInfo = conInfo
    this.conf = Object.assign({}, winConfig, conInfo)
    this.windowInstance = new BrowserWindow(this.conf)

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.windowInstance.loadURL(
`${process.env.WEBPACK_DEV_SERVER_URL}#/dashboard`)
    } else {
      createProtocol('app')
      this.windowInstance.loadURL('file://' + __dirname + '/index.html/#/dashboard')
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
    this.litenIpc()
  }

  litenIpc () {
    ipcMain.on('move-main', (event, pos) => {
      this.windowInstance && this.windowInstance.setPosition(pos.x, pos.y)
    })
    ipcMain.on('mainwin-minize', () => {
      this.windowInstance.minimize()
    })
    ipcMain.on('mainwin-maxize', () => {
      this.windowInstance.maximize()
    })
    ipcMain.on('mainwin-restore', () => {
      this.windowInstance.restore()
    })
    ipcMain.on('mainwin-close', () => {
      app.quit()
    })
  }

  getWebcontents () {
    return this.windowInstance.webContents
  }
}

export default Dashboard
