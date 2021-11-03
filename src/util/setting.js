import fs from 'fs'

let initialized = false
console.info('[setting]应用地址' + process.argv[0])
const exePath = process.argv[0].replaceAll('\\', '/')
const configPath = exePath.substring(0, exePath.lastIndexOf('/') + 1) + 'config'

const defaultConfig = {
  version: '2.4.0.1',
  common: {
    interface: {
      enableChangePageBtn: true,
      enableScaleInfo: true,
      enableBottomToolBar: true
    },
    animation: {
      move: true
    }
  },
  function: {
    penetrate: true
  }
}
let config = defaultConfig

export function loadConfig () {
  if (fs.existsSync(configPath)) {
    console.info('[setting]配置文件存在，开始读取')
    config = JSON.parse(fs.readFileSync(configPath).toString())
    console.info('[setting]配置文件读取完毕')
    if (config.version !== defaultConfig.version) {
      console.info('[setting]配置文件版本号不匹配，恢复默认配置')
      config = defaultConfig
      saveConfig(config)
    }
  } else {
    console.info('[setting]配置文件不存在，生成默认配置文件')
    saveConfig(defaultConfig)
    config = defaultConfig
  }
  initialized = true
  console.debug(config)
  return config
}

export function updateConfig (newConfig) {
  console.info('[setting]更新配置文件')
  console.debug(newConfig)
  config = JSON.parse(newConfig)
  saveConfig(config)
}

export function getConfig () {
  console.info('[setting]获取配置文件')
  if (initialized) {
    return config
  } else {
    return loadConfig()
  }
}

function saveConfig () {
  fs.writeFile(configPath, JSON.stringify(config), function (error) {
    if (error) {
      console.error('[setting]配置保存失败')
      console.error(error)
    } else {
      console.info('[setting]配置保存成功')
    }
  })
}
