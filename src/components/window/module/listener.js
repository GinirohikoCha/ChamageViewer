// 通信监听
import { dialog, ipcMain } from 'electron'
import { Image } from '@/util/image'

export class Listener {
  constructor (window, processUrl) {
    this.window = window
    this.processUrl = processUrl
    this.imageUtil = new Image(processUrl)
    // console.debug(imageUtil.getImageList())
    this.fullscreen = false

    this.registerWindow(this)
    this.registerLayout(this)
    this.registerViewer(this)
    this.registerSetting(this)
  }

  registerWindow (context) {
    ipcMain.on('window', function (event, message) {
      switch (message.event) {
        case 'minimize':
          context.window.mainWindow.minimize()
          break
        case 'maximize':
          if (message.data) {
            context.window.mainWindow.unmaximize()
          } else {
            context.window.mainWindow.maximize()
          }
          break
        case 'fullscreen':
          // ISSUE isFullScreen() 无法正确 识别状态
          // console.log(target.isFullScreen())
          context.fullscreen = !context.fullscreen
          context.window.mainWindow.setBackgroundColor(context.fullscreen ? '#DF000000' : '#FFFFFFFF')
          context.window.mainWindow.setFullScreen(context.fullscreen)
          context.window.mainWindow.setResizable(!context.fullscreen)
          context.window.mainWindow.webContents.send('layout', { event: 'fullscreen', data: context.fullscreen })
          break
        case 'close':
          context.window.mainWindow.close()
          break
      }
    })
  }

  registerLayout (context) {
    ipcMain.on('layout', function (event, message) {
      switch (message.event) {
        case 'open':
          // eslint-disable-next-line no-case-declarations
          const result = dialog.showOpenDialogSync(context.window.mainWindow, {
            title: '打开图片',
            filters: [
              { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tif', 'svg', 'psd', 'ai', 'raw', 'webp'] }
            ],
            properties: ['openFile']
          })
          if (result) {
            context.processUrl = result[0].replaceAll('\\', '/')
            context.imageUtil.init(context.processUrl)
            message.event = 'reload'
            message.data = context.imageUtil.getImageList()
            context.window.mainWindow.webContents.send('viewer', message)
          }
          break
        case 'delete':
          context.imageUtil.delete()
          message.event = 'reload'
          message.data = context.imageUtil.getImageList()
          context.window.mainWindow.webContents.send('viewer', message)
          break
        default:
          context.window.mainWindow.webContents.send('viewer', message)
          break
      }
    })
  }

  registerViewer (context) {
    ipcMain.on('load-images', function (event) {
      event.returnValue = context.imageUtil.getImageList()
    })
    ipcMain.on('viewer', function (event, message) {
      switch (message.event) {
        case 'loaded':
          context.window.mainWindow.webContents.send('layout', message)
          break
        case 'unloaded':
          context.window.mainWindow.webContents.send('layout', message)
          break
        case 'turn':
          context.imageUtil.setIndex(message.data)
          break
      }
    })
  }

  registerSetting (context) {
    ipcMain.on('setting', function (event, message) {
      switch (message.event) {
        case 'open':
          context.window.createSettingWindow().then(r => {})
          break
      }
    })
  }
}
