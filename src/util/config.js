import fs from 'fs'

let initialized = false
console.log('应用地址' + process.argv[0])
const exePath = process.argv[0].replaceAll('\\', '/')
const configPath = exePath.substring(0, exePath.lastIndexOf('/') + 1) + 'config'
const defaultConfig = {
  version: '2.0.3',
  habit: {
    scroll: {
      enable: true,
      mode: 0 // 0:缩放-1:翻页
    }
  }
}
let config = defaultConfig

export function loadConfig () {
  initialized = true
  if (fs.existsSync(configPath)) {
    fs.readFile(configPath, function (error, data) {
      if (error) {
        console.error('读取配置文件失败，返回默认配置')
        config = defaultConfig
      } else {
        config = JSON.parse(data.toString())
        if (config.version !== defaultConfig.version) {
          console.log('配置文件版本不匹配，返回默认配置')
          config = defaultConfig
          saveConfig(config)
        }
        console.log('读取配置文件成功')
      }
    })
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
