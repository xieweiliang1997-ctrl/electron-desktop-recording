'use strict'

import { app, screen, desktopCapturer, ipcMain, shell, protocol } from 'electron'
import Launch from './wins/launch'
import Dashboard from './wins/dashboard'
import { httpServer } from './utils/server'
import SuspendBall from './wins/ball'
import {
  DESIGEN_LUANCH_WIDTH,
  DESIGEN_LUANCH_HEIGHT,
  BASE_WID_WIDTH,
  BASE_WID_HEIGHT,
  DESIGEN_DASHBOARD_WIDTH,
  DESIGEN_DASHBOARD_HEIGHT,
  VIDEO_PATH,
  DESIGEN_BALL_ARC
} from './utils/constant'
const path = require('path')

const getTheLock = app.requestSingleInstanceLock()
if (!getTheLock) {
  app.quit()
} else {
  const getSize = () => {
    const { size, scaleFactor } = screen.getPrimaryDisplay()
    return {
      width: size.width * scaleFactor,
      height: size.height * scaleFactor
    }
  }
  let dashboardPage = null
  let ball = null

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (dashboardPage) {
      if (dashboardPage.isMinimized()) dashboardPage.restore()
      dashboardPage.focus()
    }
  })
  app.on('ready', async () => {
    const rect = screen.getPrimaryDisplay().bounds
    const luancW = (rect.width / BASE_WID_WIDTH) * DESIGEN_LUANCH_WIDTH
    const luancH = (rect.height / BASE_WID_HEIGHT) * DESIGEN_LUANCH_HEIGHT
    const dashW = (rect.width / BASE_WID_WIDTH) * DESIGEN_DASHBOARD_WIDTH
    const dashH = (rect.height / BASE_WID_HEIGHT) * DESIGEN_DASHBOARD_HEIGHT
    const ballArc = (rect.height / BASE_WID_HEIGHT) * DESIGEN_BALL_ARC

    const LuanchPage = new Launch({
      protocol,
      width: luancW,
      height: luancH
    })
    LuanchPage.on('show', function () {
      console.log('启动页启动了')
      httpServer()
      ball = new SuspendBall({
        protocol,
        x: 1920 - ballArc,
        y: 1080 - ballArc - 40,
        width: ballArc,
        height: ballArc
      })
      setTimeout(() => {
        dashboardPage = new Dashboard({
          protocol,
          width: dashW,
          height: dashH
        })

        dashboardPage.on('show', () => {
          LuanchPage.close()
        })
      }, 2000)
    })
  })

  ipcMain.on('startRecord', (event) => {
    dashboardPage.getWebcontents().send('record-start')
    ball.getWebcontents().send('record-start')
  })
  ipcMain.on('stopRecord', () => {
    dashboardPage.getWebcontents().send('record-stop')
    ball.getWebcontents().send('record-stop')
  })
  ipcMain.on('directory-open', (event, data) => {
    const file = path.join(VIDEO_PATH, data)
    shell.showItemInFolder(file)
  })

  ipcMain.on('resolve-desktop', async (event) => {
    const sizeInfo = getSize()
    const scource = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: sizeInfo
    })
    event.reply('reply-sorce', scource)
  })
}
