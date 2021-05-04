import fs from 'fs'

const sizeOf = require('image-size')

let imageList = null

export function openImage (url) {
  refreshImageList(url)
  return getImage(url)
}

export function getPreImage () {
  if (imageList === null || imageList.images.length === 0) {
    return null
  }
  if (--imageList.index < 0) {
    imageList.index = imageList.images.length - 1
  }
  return getImage(imageList.dir + imageList.images[imageList.index])
}

export function getNxtImage () {
  if (imageList === null || imageList.images.length === 0) {
    return null
  }
  if (++imageList.index >= imageList.images.length) {
    imageList.index = 0
  }
  return getImage(imageList.dir + imageList.images[imageList.index])
}

export function deleteImage () {
  const deleteUrl = imageList.dir + imageList.images[imageList.index]
  if (++imageList.index >= imageList.images.length) {
    imageList.index = 0
  }
  const url = imageList.dir + imageList.images[imageList.index]
  fs.unlinkSync(deleteUrl)
  return openImage(url)
}

export function getImageTitle () {
  if (imageList != null && imageList.images.length !== 0) {
    return imageList.images[imageList.index]
  } else {
    return '未选择图片'
  }
}

function getImage (url) {
  if (url != null) {
    try {
      const dimensions = sizeOf(url)
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
      refreshImageList(url)
      return getNxtImage()
    }
  } else {
    return null
  }
}

function refreshImageList (url) {
  if (url != null) {
    console.log('文件' + url)
    const slashIdx = url.lastIndexOf('/') + 1
    const dir = url.substring(0, slashIdx)
    const image = url.substring(slashIdx)
    console.log('所在文件夹' + dir)
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
    // 中文排序优化
    imageList.images.sort((item1, item2) => {
      // 是否存在中文
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
    console.log(imageList)
  }
}

function hasChinese (str) {
  return /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.test(str)
}
