import { BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const configUtil = require('@/util/config')
const imageUtil = require('@/util/image')

export let mainWindow = null
export let settingWindow = null

export function initWindow (processUrl) {
  openMainWindow()
  /// 进程通信 ///
  /// 窗口操作 ///
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
  ipcMain.on('fullscreen-window', function (event, flag, target) {
    if (target) {
      switch (target) {
        default:
        case 'mainWindow':
          target = mainWindow
          break
        case 'settingWindow':
          target = settingWindow
          break
      }
    } else {
      target = getWindow(event.sender)
    }
    // ISSUE isFullScreen() 无法正确 识别状态
    // console.log(target.isFullScreen())
    if (flag) {
      target.setBackgroundColor('#99000000')
    } else {
      target.setBackgroundColor('#FFFFFFFF')
    }
    target.setFullScreen(flag)
  })
  ipcMain.on('close-window', function (event) {
    getWindow(event.sender).close()
  })
  /// 配置操作 ///
  ipcMain.on('open-config', function (event) {
    openSettingWindow()
  })
  ipcMain.on('load-config', function (event) {
    const config = configUtil.loadConfig()
    console.log('已加载配置:' + JSON.stringify(config))
    event.sender.send('config-loaded', config)
  })
  ipcMain.on('update-config', function (event, newConfig) {
    configUtil.updateConfig(newConfig)
    mainWindow.webContents.send('config-loaded', newConfig)
  })
  ipcMain.on('get-config', function (event) {
    event.returnValue = configUtil.getConfig()
  })
  /// 图片操作 ///
  ipcMain.on('open-image', function (event) {
    processUrl = dialog.showOpenDialogSync(mainWindow, {
      title: '打开图片',
      filters: [
        { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tif', 'svg', 'psd', 'ai', 'raw', 'webp'] }
      ],
      properties: ['openFile']
    })[0].replaceAll('\\', '/')
    event.returnValue = imageUtil.loadImageAndDir(processUrl)
  })
  ipcMain.on('init-image', function (event) {
    event.returnValue = imageUtil.loadImageAndDir(processUrl)
  })
  ipcMain.on('load-image', function (event, url, name, index) {
    event.returnValue = imageUtil.loadImage(url, name, index)
  })
  ipcMain.on('change-image', function (event, index) {
    event.returnValue = imageUtil.changeImage(index)
  })
  ipcMain.on('delete-image', function (event) {
    event.returnValue = imageUtil.deleteImage()
  })
  ipcMain.on('comic', function (event, index) {
    event.returnValue = imageUtil.getImageAndDir()
  })
  /// ///
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
    minWidth: 138,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    transparent: true,
    backgroundColor: '#FFFFFFFF',
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
  settingWindow.setMenu(null)

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
