import fs from 'fs'
const sizeOf = require('image-size')

export class Image {
  constructor (imageUrl) {
    this.init(imageUrl)
  }

  init (imageUrl) {
    console.info('[image]开始初始化加载')
    const slashIdx = imageUrl.lastIndexOf('/') + 1
    this.index = 0
    this.imageUrl = imageUrl
    this.imageName = imageUrl.substring(slashIdx)
    this.dirUrl = imageUrl.substring(0, slashIdx)
    this.imageList = []
    console.info('[image]正在加载图片路径:' + this.imageUrl)
    console.info('[image]正在加载图片所在文件夹路径:' + this.dirUrl)
    this.loadImageList()
    // console.info('[image]正在加载初始图片...')
    // this.loadImage()
    console.info('[image]初始化加载结束')
  }

  loadImageList () {
    console.info('[image]正在查找文件夹中所有图片...')
    const that = this
    // 遍历图片
    fs.readdirSync(this.dirUrl).forEach(function (item, index) {
      try {
        const dimensions = sizeOf(that.dirUrl + item)
        console.info('[image]正在加载图片' + item)
        if (that.imageName === item) {
          that.index = index
        }
        that.imageList.push({
          name: item,
          data: {
            url: that.dirUrl + item,
            type: dimensions.type,
            width: dimensions.width,
            height: dimensions.height
          },
          attr: {
            // 是否为长图（垂直）
            longV: dimensions.width / dimensions.height <= 0.4,
            // 是否为长图（水平）
            longH: dimensions.height / dimensions.width <= 0.4,
            scale: 0,
            left: 0,
            top: 0,
            rotate: 0
          }
        })
      } catch (err) {}
    })
    console.info('[image]查找结束')
    console.info('[image]初始图片序号' + this.index)
    console.info('[image]正在优化图片顺序...')
    // TODO
    console.info('[image]优化结束')
  }

  getImageList () {
    return { 'index': this.index, 'images': this.imageList }
  }
}
