import { BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const configUtil = require('@/util/config')
const imageUtil = require('@/util/image')

const fileUtil = require('@/util/file')

export let mainWindow = null
export let settingWindow = null

export function initWindow (processUrl) {
  openMainWindow()
  // 进程通信
  // 窗口操作
  ipcMain.on('minimize-window', function (event) {
    getWindow(event.sender).minimize()
  })
  ipcMain.on('maximize-window', function (event) {
    const target = getWindow(event.sender)
    if (target.isMaximized()) {
      target.unmaximize()
    } else {
      target.maximize()
    }
  })
  ipcMain.on('close-window', function (event) {
    getWindow(event.sender).close()
  })
  // 配置操作
  ipcMain.on('open-config', function (event) {
    openSettingWindow()
  })
  ipcMain.on('load-config', function (event) {
    const config = configUtil.loadConfig()
    console.log('已加载配置:')
    console.log(JSON.stringify(config))
    event.sender.send('config-loaded', config)
  })
  ipcMain.on('update-config', function (event, newConfig) {
    configUtil.updateConfig(newConfig)
    mainWindow.webContents.send('config-loaded', newConfig)
  })
  ipcMain.on('get-config', function (event) {
    event.returnValue = configUtil.getConfig()
  })
  // 图片操作
  ipcMain.on('open-image', function (event) {
    processUrl = dialog.showOpenDialogSync(mainWindow, {
      title: '打开图片',
      filters: [
        { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tif', 'svg', 'psd', 'ai', 'raw', 'webp'] }
      ],
      properties: ['openFile']
    })[0].replaceAll('\\', '/')
    event.returnValue = fileUtil.openImage(processUrl)
    mainWindow.setTitle(fileUtil.getImageTitle())
  })
  ipcMain.on('init-image', function (event) {
    event.returnValue = imageUtil.loadImageAndDir(processUrl)
  })
  ipcMain.on('delete-image', function (event) {
    event.returnValue = fileUtil.deleteImage()
    mainWindow.setTitle(fileUtil.getImageTitle())
  })
  ipcMain.on('next-image', function (event) {
    event.returnValue = fileUtil.getNxtImage()
    mainWindow.setTitle(fileUtil.getImageTitle())
  })
  ipcMain.on('pre-image', function (event) {
    event.returnValue = fileUtil.getPreImage()
    mainWindow.setTitle(fileUtil.getImageTitle())
  })
  ipcMain.on('list-image', function (event) {
    event.returnValue = fileUtil.getImageList()
  })
  ipcMain.on('test', function (event) {
    const exePath = process.argv[0].replaceAll('\\', '/')
    event.returnValue = exePath.substring(0, exePath.lastIndexOf('/'))
  })
}

export function openMainWindow () {
  createMainWindow()
}

export function openSettingWindow () {
  if (settingWindow) {
    settingWindow.show()
  } else {
    createSettingWindow()
  }
}

async function createMainWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false,
    show: false
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

function createSettingWindow () {
  settingWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: mainWindow,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    show: false
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    settingWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/config')
    if (!process.env.IS_TEST) settingWindow.webContents.openDevTools()
  } else {
    settingWindow.loadURL('app://./index.html/#/config')
  }
  settingWindow.once('ready-to-show', () => {
    settingWindow.setTitle('设置')
    settingWindow.show()
  })
  settingWindow.on('close', (e) => {
    e.preventDefault()
    settingWindow.hide()
  })
}

function getWindow (webContents) {
  switch (webContents) {
    case mainWindow.webContents:
      return mainWindow
    case settingWindow.webContents:
      return settingWindow
    default:
      return null
  }
}
