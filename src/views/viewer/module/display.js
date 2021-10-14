import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'

export class Display {
  // 单例
  static display = null
  // 图片加载状态
  loaded = false
  // 顶部Message消息对象，用于进行关闭
  message = null

  config = {
    common: {
      interface: {
        enableChangePageBtn: true,
        enableScaleInfo: true,
        enableBottomToolBar: true
      }
    },
    function: {
      penetrate: true
    }
  }

  /**
   * @description 初始化图片，根据当前窗口大小和原始图片大小缩放图片，适应当前窗口
   * @param {Number} index 当前图片序号
   * @param {Array} images 当前文件夹下图片数据列表
   * @param {Function} refreshHandler 刷新图片回调
   * @return {Object} 当前图片数据
   * **/
  constructor (index, images, refreshHandler) {
    // 单例模式
    if (Display.display == null) {
      Display.display = this
    } else {
      Display.display.images = images
      Display.display.setIndex(index)
      Display.display.loaded = false
      return Display.display
    }
    this.refreshHandler = refreshHandler
    this.images = images || []
    this.setIndex(index)
  }

  /**
   * @description 初始化图片，根据当前窗口大小和原始图片大小缩放图片，适应当前窗口
   * @param {Number} index 默认初始化当前图片
   * @return {Object} 当前图片数据
   * **/
  init (index = this.index) {
    const image = this.images[index]
    if (image) {
      // 计算长宽比，初始化缩放图片
      const ratio = image.data.width / image.data.height
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      let scale = 1
      let left = (windowWidth - image.data.width) / 2
      let top = (windowHeight - image.data.height) / 2

      if (image.attr.longV) { // 长图
        scale = (windowWidth * 0.6) / image.data.width
        top = 0
        left = windowWidth * 0.2
      } else if (image.attr.longH) {
        scale = (windowHeight * 0.6) / image.data.height
        left = 0
        top = windowHeight * 0.2
      } else { // 正常图片
        if (ratio >= windowWidth / windowHeight) {
          // 大图片根据宽缩小
          if (image.data.width > windowWidth) {
            scale = (windowWidth - 1) / image.data.width
            left = 0
            top = (windowHeight - image.data.height * scale) / 2
          }
        } else {
          // 大图片根据高缩小
          if (image.data.height > windowHeight) {
            scale = (windowHeight - 1) / image.data.height
            left = (windowWidth - image.data.width * scale) / 2
            top = 0
          }
        }
      }
      image.attr.scale = scale
      image.attr.left = left
      image.attr.top = top
      image.attr.rotate = 0
      this.loaded = true
      ipcRenderer.send('viewer', {
        event: 'loaded',
        data: {
          name: image.name,
          width: image.data.width,
          height: image.data.height
        }
      })
      return image
    } else {
      ipcRenderer.send('viewer', { event: 'unloaded' })
      return {
        name: '',
        data: {
          url: '',
          type: '',
          width: 0,
          height: 0
        },
        attr: {
          longV: false,
          longH: false,
          scale: 0,
          left: 0,
          top: 0,
          rotate: 0
        }
      }
    }
  }

  /**
   * @description 翻页
   * @param {Boolean} isNext 是否往后翻页，true为下一张，false为上一张
   * @return {Object} 当前图片数据
   * **/
  turn (isNext) {
    if (this.loaded) {
      const context = this
      // 上一页
      if (isNext && this.index < this.images.length - 1) {
        this.setIndex(this.index + 1)
        ipcRenderer.send('viewer', { event: 'turn', data: this.index })
      // 下一页
      } else if (!isNext && this.index > 0) {
        this.setIndex(this.index - 1)
        ipcRenderer.send('viewer', { event: 'turn', data: this.index })
      } else {
        // 是否开启了文件夹穿透
        if (this.config.function.penetrate) {
          // 最后一页
          if (isNext && this.index === this.images.length - 1) {
            const dirName = ipcRenderer.sendSync('viewer', { event: 'penetrate', data: true })
            this.refreshHandler()
            // 文件夹提醒，与refreshHandler中setIndex的showMessage同时发出会导致显示错误
            setTimeout(function () { context.showMessage('正在浏览文件夹：' + dirName) }, 200)
          } else if (!isNext && this.index === 0) {
            const dirName = ipcRenderer.sendSync('viewer', { event: 'penetrate', data: false })
            this.refreshHandler()
            // 文件夹提醒，与refreshHandler中setIndex的showMessage同时发出会导致显示错误
            setTimeout(function () { context.showMessage('正在浏览文件夹：' + dirName) }, 200)
          }
        }
      }
      // 切换页面后对当前图片大小进行初始化调整
      // TODO （选项）保留已经浏览过的图片的top、left、scale状态，不再重新初始化刷新
      return this.init()
    }
  }

  /**
   * @description 移动当前图片
   * @param {Number} deltaX X轴增量
   * @param {Number} deltaY Y轴增量
   * @return {Object} 当前图片数据
   * **/
  move (deltaX, deltaY) {
    if (this.loaded) {
      const image = this.images[this.index]
      image.attr.left += deltaX
      image.attr.top += deltaY
      return image
    }
  }

  /**
   * @description 缩放当前图片
   * @param {Number} deltaS scale增量
   * @param {Object} mouse 当前鼠标悬停及位置信息，提供给scaleTo
   * @return {Object} 当前图片数据
   * **/
  scale (deltaS, mouse) {
    if (this.loaded) {
      const image = this.images[this.index]
      // 缩放上限
      if (image.attr.scale + deltaS > 50) {
        return this.scaleTo(500, mouse)
      // 缩放下限
      } else if (image.attr.scale + deltaS <= 0) {
        return this.scaleTo(0.01, mouse)
      } else {
        return this.scaleTo(image.attr.scale + deltaS, mouse)
      }
    }
  }

  /**
   * @description 缩放当前图片至指定值
   * @param {Number} newScale 新的图片比例缩放值
   * @param {Object} mouse 当前鼠标悬停及位置信息，可空
   * @return {Object} 当前图片数据
   * **/
  scaleTo (newScale, mouse) {
    if (this.loaded) {
      const image = this.images[this.index]
      console.debug('[display]newScale:' + newScale)
      const deltaX = image.data.width * (newScale - image.attr.scale)
      const deltaY = image.data.height * (newScale - image.attr.scale)
      console.debug('[display]deltaX:' + deltaX + ',deltaY:' + deltaY)
      // 当鼠标悬停在图片上时，鼠标所指像素位置不变
      if (mouse && mouse.hover) {
        // 长图时短边位置不跟随鼠标，保证图片在水平中央
        if (image.attr.longV) {
          this.move(-deltaX / 2, -deltaY * (mouse.mouseY - image.attr.top) / image.data.height / image.attr.scale)
        // 长图时短边位置不跟随鼠标，保证图片在垂直中央
        } else if (image.attr.longH) {
          this.move(-deltaX * (mouse.mouseX - image.attr.left) / image.data.width / image.attr.scale, -deltaY / 2)
        } else {
          this.move(-deltaX * (mouse.mouseX - image.attr.left) / image.data.width / image.attr.scale,
            -deltaY * (mouse.mouseY - image.attr.top) / image.data.height / image.attr.scale)
        }
      } else {
        // 图片自中心放大（图片中心像素位置不变）
        this.move(-deltaX / 2, -deltaY / 2)
      }
      image.attr.scale = newScale
      return image
    }
  }

  /**
   * @description 旋转当前图片
   * @param {Boolean} isClockwise 是否顺时针旋转
   * @return {Object} 当前图片数据
   * **/
  rotate (isClockwise) {
    if (this.loaded) {
      const image = this.images[this.index]
      if (isClockwise) {
        image.attr.rotate += 90
      } else {
        image.attr.rotate += -90
      }
      return image
    }
  }

  /**
   * @description 长图模式下浏览图片
   * @param {Number} offset 图片沿长边移动距离（px）
   * @param {Boolean} vertical 是否是垂直长图
   * @return {Object} 当前图片数据
   * **/
  skim (offset, vertical) {
    if (this.loaded) {
      const image = this.images[this.index]
      if (vertical) {
        // 限制图片不移动出屏幕
        if ((offset < 0 && image.attr.top < 0) ||
          (offset > 0 && image.attr.top > -image.data.height * image.attr.scale + window.innerHeight)) {
          return this.move(0, -offset)
        }
      } else {
        if ((offset < 0 && image.attr.left < 0) ||
          (offset > 0 && image.attr.left > -image.data.width * image.attr.scale + window.innerWidth)) {
          return this.move(-offset, 0)
        }
      }
    }
  }

  /**
   * @description 设置当前图片
   * @param {Number} index 图片在images中的序号
   * **/
  setIndex (index) {
    this.index = index
    if (this.index === 0) {
      this.showMessage('正在浏览第一张图片')
    } else if (this.index === this.images.length - 1) {
      this.showMessage('正在浏览最后一张图片')
    }
  }

  /**
   * @description 设置配置选项
   * @param {Object} config 配置选项
   * **/
  setConfig (config) {
    this.config = config
  }

  /**
   * @description 显示顶部Message消息，仅显示一条
   * @param {String} content 消息内容
   * **/
  showMessage (content) {
    // ISSUE 短时间内连发两条消息会导致显示错误
    if (this.message != null) {
      this.message.close()
      this.message = null
    }
    this.message = ElMessage({
      message: content,
      center: true,
      duration: 1500
    })
  }
}
