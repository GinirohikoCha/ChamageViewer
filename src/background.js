'use strict'

import { app, protocol, ipcMain, BrowserWindow, Menu, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const configUtil = require('@/util/config')
const imageUtil = require('@/util/image')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win = null
let winSetting = null
console.debug(process.env.WEBPACK_DEV_SERVER_URL)

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    show: false
  })
  Menu.setApplicationMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.once('ready-to-show', () => {
    win.show()
  })
}

function createSettingWindow () {
  if (winSetting) {
    winSetting.show()
  } else {
    winSetting = new BrowserWindow({
      width: 600,
      height: 400,
      parent: win,
      title: '设置',
      resizable: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      },
      show: false
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      winSetting.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/config')
      if (!process.env.IS_TEST) winSetting.webContents.openDevTools()
    } else {
      winSetting.loadURL('app://./index.html/#/config')
    }
    winSetting.once('ready-to-show', () => {
      winSetting.show()
    })
    winSetting.on('close', (e) => {
      e.preventDefault()
      winSetting.hide()
    })
  }
}

let processUrl = ''
if (process.env.WEBPACK_DEV_SERVER_URL) {
  const debugUrl = 'C:\\Users\\22364\\Pictures\\Never Settle\\Salmon.jpg'
  processUrl = debugUrl.replaceAll('\\', '/')
} else {
  processUrl = process.argv[1].replaceAll('\\', '/')
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
  // 配置操作
  ipcMain.on('open-config', function (event) {
    createSettingWindow()
  })
  ipcMain.on('load-config', function (event) {
    const config = configUtil.loadConfig()
    console.log('已加载配置:')
    console.log(config)
    event.sender.send('config-loaded', config)
  })
  ipcMain.on('update-config', function (event, newConfig) {
    configUtil.updateConfig(newConfig)
    win.webContents.send('config-loaded', newConfig)
  })
  ipcMain.on('get-config', function (event) {
    event.returnValue = configUtil.getConfig()
  })
  // 图片操作
  ipcMain.on('open-image', function (event) {
    processUrl = dialog.showOpenDialogSync(win, {
      title: '打开图片',
      filters: [
        { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tif', 'svg', 'psd', 'ai', 'raw', 'webp'] }
      ],
      properties: ['openFile']
    })[0].replaceAll('\\', '/')
    event.returnValue = imageUtil.openImage(processUrl)
    win.setTitle(imageUtil.getImageTitle())
  })
  ipcMain.on('init-image', function (event) {
    event.returnValue = imageUtil.openImage(processUrl)
    win.setTitle(imageUtil.getImageTitle())
  })
  ipcMain.on('delete-image', function (event) {
    event.returnValue = imageUtil.deleteImage()
    win.setTitle(imageUtil.getImageTitle())
  })
  ipcMain.on('next-image', function (event) {
    event.returnValue = imageUtil.getNxtImage()
    win.setTitle(imageUtil.getImageTitle())
  })
  ipcMain.on('pre-image', function (event) {
    event.returnValue = imageUtil.getPreImage()
    win.setTitle(imageUtil.getImageTitle())
  })
  ipcMain.on('test', function (event) {
    const exePath = process.argv[0].replaceAll('\\', '/')
    event.returnValue = exePath.substring(0, exePath.lastIndexOf('/'))
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
