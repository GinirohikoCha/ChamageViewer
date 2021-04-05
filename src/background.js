'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
const sizeOf = require('image-size')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// const debugUrl = 'C:\\Users\\22364\\OneDrive\\桌面\\Never Settle\\Goat.jpg'
// let url = debugUrl.replaceAll('\\', '/')
let url = process.argv[1].replaceAll('\\', '/')
let imageList = null

function getImageData () {
  if (url != null) {
    const dimensions = sizeOf(url)
    return {
      index: imageList.index,
      total: imageList.images.length,
      data: {
        url: url,
        type: dimensions.type,
        originWidth: dimensions.width,
        originHeight: dimensions.height
      }
    }
  } else {
    return null
  }
}

function refreshImageList () {
  if (url != null) {
    console.log(url)
    const slashIdx = url.lastIndexOf('/') + 1
    const dir = url.substring(0, slashIdx)
    const image = url.substring(slashIdx)
    console.log(dir)
    imageList = { dir: dir, index: 0, images: [] }
    fs.readdirSync(dir).forEach(function (item, index) {
      if (image === item) {
        imageList.index = imageList.images.length
        imageList.images.push(item)
      } else {
        try {
          sizeOf(dir + item)
          imageList.images.push(item)
        } catch (err) {}
      }
    })
    console.log(imageList)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 自定义file:///协议的解析
  protocol.interceptFileProtocol('file', (req, callback) => {
    const url = req.url.substr(8)
    callback(decodeURI(url))
  }, (error) => {
    if (error) {
      console.error('Failed to register protocol')
    }
  })

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // 创建窗口
  createWindow()
  // 进程通信
  ipcMain.on('init-image', function (event) {
    refreshImageList()
    event.returnValue = getImageData()
  })
  ipcMain.on('next-image', function (event) {
    if (++imageList.index >= imageList.images.length) {
      imageList.index = 0
    }
    url = imageList.dir + imageList.images[imageList.index]
    event.returnValue = getImageData()
  })
  ipcMain.on('pre-image', function (event) {
    if (--imageList.index < 0) {
      imageList.index = imageList.images.length - 1
    }
    url = imageList.dir + imageList.images[imageList.index]
    event.returnValue = getImageData()
  })
  ipcMain.on('test', function (event) {
    event.returnValue = url
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
