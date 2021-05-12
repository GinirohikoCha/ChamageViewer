import fs from 'fs'

let initialized = false
console.log('应用地址' + process.argv[0])
const exePath = process.argv[0].replaceAll('\\', '/')
const configPath = exePath.substring(0, exePath.lastIndexOf('/') + 1) + 'config'
const defaultConfig = {
  version: '2.3.21',
  common: {
    interface: {
      enableChangePageBtn: true,
      enableScaleInfo: true,
      enableBottomToolBar: true
    }
  },
  habit: {
    scroll: {
      mode: 0 // 0-翻页:1-缩放
    }
  }
}
let config = defaultConfig

export function loadConfig () {
  initialized = true
  if (fs.existsSync(configPath)) {
    console.log('配置文件存在，开始读取')
    config = JSON.parse(fs.readFileSync(configPath).toString())
    console.log('配置文件读取完毕')
    if (config.version !== defaultConfig.version) {
      console.log('配置文件版本不匹配，返回默认配置')
      config = defaultConfig
      saveConfig(config)
    }
  } else {
    console.log('配置文件不存在，生成默认配置文件')
    saveConfig(defaultConfig)
    config = defaultConfig
  }
  return config
}

export function updateConfig (newConfig) {
  config = newConfig
  saveConfig(config)
}

export function getConfig () {
  if (initialized) {
    return config
  } else {
    return loadConfig()
  }
}

function saveConfig () {
  fs.writeFile(configPath, JSON.stringify(config), function (error) {
    if (error) {
      console.error('配置更新失败')
      console.error(error)
    } else { console.log('配置已更新') }
  })
}
