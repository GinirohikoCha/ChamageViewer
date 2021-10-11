import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'

export class Display {
  static display = null
  loaded = false
  message = null

  constructor (index, images) {
    if (Display.display == null) {
      Display.display = this
    } else {
      Display.display.images = images
      Display.display.setIndex(index)
      Display.display.loaded = false
      return Display.display
    }
    this.images = images || []
    this.setIndex(index)
  }

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

  turn (isDown) {
    if (this.loaded) {
      if (isDown && this.index < this.images.length - 1) {
        this.setIndex(this.index + 1)
      } else if (!isDown && this.index > 0) {
        this.setIndex(this.index - 1)
      }
      ipcRenderer.send('viewer', { event: 'turn', data: this.index })
      return this.init()
    }
  }

  move (deltaX, deltaY) {
    if (this.loaded) {
      const image = this.images[this.index]
      image.attr.left += deltaX
      image.attr.top += deltaY
      return image
    }
  }

  scale (deltaS, mouse) {
    if (this.loaded) {
      const image = this.images[this.index]
      if (image.attr.scale + deltaS > 50) {
        return this.scaleTo(500, mouse)
      } else if (image.attr.scale + deltaS <= 0) {
        return this.scaleTo(0.01, mouse)
      } else {
        return this.scaleTo(image.attr.scale + deltaS, mouse)
      }
    }
  }

  scaleTo (newScale, mouse) {
    if (this.loaded) {
      const image = this.images[this.index]
      console.debug('[display]newScale:' + newScale)
      const deltaX = image.data.width * (newScale - image.attr.scale)
      const deltaY = image.data.height * (newScale - image.attr.scale)
      console.debug('[display]deltaX:' + deltaX + ',deltaY:' + deltaY)
      if (mouse && mouse.hover) {
        if (image.attr.longV) {
          this.move(-deltaX / 2, -deltaY * (mouse.mouseY - image.attr.top) / image.data.height / image.attr.scale)
        } else if (image.attr.longH) {
          this.move(-deltaX * (mouse.mouseX - image.attr.left) / image.data.width / image.attr.scale, -deltaY / 2)
        } else {
          this.move(-deltaX * (mouse.mouseX - image.attr.left) / image.data.width / image.attr.scale,
            -deltaY * (mouse.mouseY - image.attr.top) / image.data.height / image.attr.scale)
        }
      } else {
        this.move(-deltaX / 2, -deltaY / 2)
      }
      image.attr.scale = newScale
      return image
    }
  }

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

  skim (offset, vertical) {
    if (this.loaded) {
      const image = this.images[this.index]
      if (vertical) {
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

  setIndex (index) {
    this.index = index
    switch (this.index) {
      case 0:
        this.showMessage('正在浏览第一张图片')
        break
      case this.images.length - 1:
        this.showMessage('正在浏览最后一张图片')
        break
    }
  }

  showMessage (content) {
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
