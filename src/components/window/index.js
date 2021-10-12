import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Listener } from '@/components/window/module/listener'

export class Window {
  constructor (processUrl) {
    this.mainWindow = null
    this.settingWindow = null
    this.listener = new Listener(this, processUrl)
  }

  async createMainWindow () {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 138,
      minHeight: 200,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      },
      transparent: true,
      backgroundColor: '#FFFFFFFF',
      frame: false,
      show: true
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await this.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (!process.env.IS_TEST) this.mainWindow.webContents.openDevTools()
    } else {
      createProtocol('app')
      await this.mainWindow.loadURL('app://./index.html')
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show()
    })
  }

  async createSettingWindow () {
    if (this.settingWindow) {
      this.settingWindow.show()
    } else {
      this.settingWindow = new BrowserWindow({
        width: 600,
        height: 400,
        parent: this.mainWindow,
        resizable: false,
        webPreferences: {
          webSecurity: false,
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        },
        show: false
      })
      this.settingWindow.setMenu(null)

      if (process.env.WEBPACK_DEV_SERVER_URL) {
        await this.settingWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/setting')
        if (!process.env.IS_TEST) this.settingWindow.webContents.openDevTools()
      } else {
        await this.settingWindow.loadURL('app://./index.html/#/setting')
      }

      this.settingWindow.once('ready-to-show', () => {
        this.settingWindow.setTitle('设置')
        this.settingWindow.show()
      })

      this.settingWindow.on('close', (e) => {
        e.preventDefault()
        this.settingWindow.hide()
      })
    }
  }
}
