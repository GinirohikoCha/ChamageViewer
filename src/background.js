'use strict'

import { app, protocol, ipcMain, BrowserWindow, Menu, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
const sizeOf = require('image-size')
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

let url = ''
if (process.env.WEBPACK_DEV_SERVER_URL) {
  const debugUrl = 'C:\\Users\\22364\\Pictures\\Never Settle\\Salmon.jpg'
  url = debugUrl.replaceAll('\\', '/')
} else {
  url = process.argv[1].replaceAll('\\', '/')
}
let imageList = null

function getImageData () {
  if (url != null) {
    try {
      const dimensions = sizeOf(url)
      win.setTitle(imageList.images[imageList.index])
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
    } catch (err) {
      console.log('无法找到当前图片路径:' + url)
      return null
    }
  } else {
    return null
  }
}

function refreshImageList () {
  if (url != null) {
    console.log('文件' + url)
    const slashIdx = url.lastIndexOf('/') + 1
    const dir = url.substring(0, slashIdx)
    const image = url.substring(slashIdx)
    console.log('文件夹' + dir)
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

console.log('应用地址' + process.argv[0])
const defaultConfig = {
  scrollMode: 0 // 0:缩放-1:换页
}
let config = defaultConfig

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
  ipcMain.on('open-config', function (event) {
    createSettingWindow()
  })
  ipcMain.on('load-config', function (event) {
    const exePath = process.argv[0].replaceAll('\\', '/')
    const configPath = exePath.substring(0, exePath.lastIndexOf('/') + 1) + 'config'
    if (fs.existsSync(configPath)) {
      fs.readFile(configPath, function (error, data) {
        if (error) {
          event.sender.send('config-loaded', defaultConfig)
        } else {
          config = JSON.parse(data.toString())
          event.sender.send('config-loaded', config)
        }
      })
    } else {
      fs.writeFile(configPath, JSON.stringify(defaultConfig), function (error) {
        if (error) { console.error('写入失败') } else { console.log('写入成功') }
      })
      event.sender.send('config-loaded', defaultConfig)
    }
  })
  ipcMain.on('open-image', function (event) {
    url = dialog.showOpenDialogSync(win, {
      title: '打开图片',
      filters: [
        { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tif', 'svg', 'psd', 'ai', 'raw', 'webp'] }
      ],
      properties: ['openFile']
    })[0].replaceAll('\\', '/')
    refreshImageList()
    event.returnValue = getImageData()
  })
  ipcMain.on('init-image', function (event) {
    refreshImageList()
    event.returnValue = getImageData()
  })
  ipcMain.on('delete-image', function (event) {
    const deleteUrl = url
    if (++imageList.index >= imageList.images.length) {
      imageList.index = 0
    }
    url = imageList.dir + imageList.images[imageList.index]
    fs.unlinkSync(deleteUrl)
    refreshImageList()
    event.returnValue = getImageData()
  })
  ipcMain.on('next-image', function (event) {
    if (imageList === null || imageList.images.length === 0) {
      event.returnValue = null
    }
    if (++imageList.index >= imageList.images.length) {
      imageList.index = 0
    }
    url = imageList.dir + imageList.images[imageList.index]
    event.returnValue = getImageData()
  })
  ipcMain.on('pre-image', function (event) {
    if (imageList === null || imageList.images.length === 0) {
      event.returnValue = null
    }
    if (--imageList.index < 0) {
      imageList.index = imageList.images.length - 1
    }
    url = imageList.dir + imageList.images[imageList.index]
    event.returnValue = getImageData()
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
