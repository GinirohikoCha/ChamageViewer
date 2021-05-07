import fs from 'fs'
const sizeOf = require('image-size')

const TAG = '[image]'

let imageList = { dir: '', index: 0, images: [] }

// 加载图片以及图片所在文件夹内的所有图片
export function loadImageAndDir (url) {
  console.info('开始进行初始化加载')
  if (url != null) {
    const slashIdx = url.lastIndexOf('/') + 1
    const dir = url.substring(0, slashIdx)
    const imageName = url.substring(slashIdx)
    console.info('正在加载图片路径:' + url)
    console.info('正在加载图片所在文件夹路径:' + dir)
    imageList = { dir: dir, index: 0, images: [] }
    console.info('正在查找文件夹中所有图片...')
    // 遍历图片
    fs.readdirSync(dir).forEach(function (item, index) {
      try {
        sizeOf(dir + item)
        imageList.images.push(item)
      } catch (err) {}
    })
    console.info('查找完毕')
    console.info('正在对查找到的所有图片进行排序...')
    // 中文排序优化
    imageList.images.sort((item1, item2) => {
      if (hasChinese(item1) || hasChinese(item2)) {
        for (let i = 0; i < Math.min(item1.length, item2.length); i++) {
          const char1 = item1.charAt(i)
          const char2 = item2.charAt(i)
          if (char1 !== char2) {
            if (hasChinese(char1) && hasChinese(char2)) {
              return item1.localeCompare(item2)
            } else {
              return 0
            }
          }
        }
      }
    })
    console.info('排序完毕')
    console.info('正在加载初始图片...')
    // 加载初始化图片
    for (let i = 0; i < imageList.images.length; i++) {
      if (imageName === imageList.images[i]) {
        imageList.index = i
        imageList.images[i] = loadImage(imageList.dir + imageList.images[i], imageName)
        break
      }
    }
    console.info('加载初始图片完毕')
    console.debug(JSON.stringify(imageList))
    console.info('完成初始化加载')
    return imageList
  } else {
    console.error('无法找到当前图片路径')
    console.info('结束初始化加载')
    return { dir: '', index: 0, images: [] }
  }
}

function loadImage (url, name) {
  console.info(TAG + 'loadImage:正在加载图片...')
  if (url != null) {
    try {
      const dimensions = sizeOf(url)
      return {
        name: name,
        data: {
          url: url,
          type: dimensions.type,
          width: dimensions.width,
          height: dimensions.height
        },
        attr: {
          long: dimensions.width / dimensions.height <= 0.4, // 是否为长图
          initScale: 0,
          initLeft: 0,
          initTop: 0
        }
      }
    } catch (err) {
      console.warn(TAG + 'loadImage:无法找到当前图片路径:' + url)
      // TODO 处理
      return null
    }
  } else {
    console.error(TAG + 'loadImage:未获得图片路径')
    // TODO 处理
    return null
  }
}

// 字符串是否存在中文
function hasChinese (str) {
  return /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.test(str)
}
