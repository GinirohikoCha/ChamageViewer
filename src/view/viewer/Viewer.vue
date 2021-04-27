<template>
  <ImageDisplay
    :is-empty="isEmpty"
    :url="image.data.url"
    :width="width"
    :height="height"
    :left="left"
    :top="top"
    :rotate="rotate" />

  <ChangePageBtn
    v-if="config.common.interface.enableChangePageBtn && !isEmpty"
    :show="show.changePageBtn" />
  <ScaleInfo
    v-if="config.common.interface.enableScaleInfo"
    :scale="scale" />
  <BottomToolBar
    v-if="config.common.interface.enableBottomToolBar"
    :toggle="show.toolbar"
    :scale-prop="scale"
    :config="config"
    :is-long="isLong" />
</template>

<script>
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import ImageDisplay from '@/view/components/ImageDisplay'
import ScaleInfo from '@/view/components/ScaleInfo'
import BottomToolBar from '@/view/components/BottomToolBar'
import ChangePageBtn from '@/view/components/ChangePageBtn'

export default {
  name: 'Viewer',
  components: {
    ImageDisplay,
    ScaleInfo,
    BottomToolBar,
    ChangePageBtn
  },
  data () {
    return {
      // 设置
      config: {
        version: '0.0.0',
        common: {
          interface: {
            enableChangePageBtn: true,
            enableScaleInfo: true,
            enableBottomToolBar: true
          }
        },
        habit: {
          scroll: {
            enable: true,
            mode: 0 // 0:缩放-1:翻页
          }
        }
      },
      // 系统
      isEmpty: true,
      isHover: false,
      isDragging: false,
      isLong: false,
      scrollMode: 0,
      mouse: {
        x: 0,
        y: 0
      },
      // 图片显示
      image: {
        index: 0,
        total: 0,
        data: {
          url: '',
          type: 'jpg',
          originWidth: 1920,
          originHeight: 1080
        }
      },
      scale: 1,
      left: -1,
      top: -1,
      originLeft: 0,
      originTop: 0,
      rotate: 0,
      // 提示区
      show: {
        toolbar: false,
        changePageBtn: false
      },
      // 消息提示框
      message: null
    }
  },
  computed: {
    width: function () {
      return this.image.data.originWidth * this.scale
    },
    height: function () {
      return this.image.data.originHeight * this.scale
    },
    animatedScale: function () {
      return (this.tweenScale * 100).toFixed(0) + '%'
    }
  },
  mounted () {
    const that = this
    ipcRenderer.on('config-loaded', function (event, arg) {
      that.config = arg
      that.scrollMode = arg.habit.scroll.mode
      console.log('读取配置文件成功')
    })
    ipcRenderer.send('load-config')
    // 初始化
    this.showImage(ipcRenderer.sendSync('init-image'))
    // 全局操作监听
    window.onmousedown = function (e) {
      if (!that.isEmpty) {
        that.mouse.x = e.clientX
        that.mouse.y = e.clientY
        that.originLeft = that.left
        that.originTop = that.top
      }
    }
    window.onmouseup = function (e) {
      if (!that.isEmpty) {
        that.setDragging(false)
      }
    }
    window.onmousemove = function (e) {
      if (!that.isEmpty) {
        if (that.isDragging) {
          that.dragImg(e)
        } else {
          if (that.isHover) {
            that.mouse.x = e.clientX
            that.mouse.y = e.clientY
          }
        }
        // 根据区域显隐按钮&工具
        that.show.toolbar = document.documentElement.clientHeight - e.clientY <= 45
        that.show.changePageBtn = e.clientX <= 70 || document.documentElement.clientWidth - e.clientX <= 70
      }
    }
    window.onmousewheel = function (e) {
      if (!that.isEmpty && that.config.habit.scroll.enable) {
        switch (that.scrollMode) {
          default:
          case 0:
            that.scaleImg(e.deltaY > 0)
            break
          case 1:
            if (e.deltaY > 0) {
              that.nextImg()
            } else {
              that.preImg()
            }
            break
          case 2:
            that.glance(e.deltaY)
            break
        }
      }
    }
    window.onkeydown = function (e) {
      switch (e.code) {
        case 'ArrowLeft':
          that.preImg()
          break
        case 'ArrowRight':
          that.nextImg()
          break
        case 'ArrowUp':
          if (that.scrollMode === 3) {
            that.glance(-100)
          } else {
            that.preImg()
          }
          break
        case 'ArrowDown':
          if (that.scrollMode === 3) {
            that.glance(100)
          } else {
            that.nextImg()
          }
          break
      }
    }
    window.onresize = function (e) {
      const data = that.initImg(that.image)
      that.scale = data.scale
      that.left = data.left
      that.top = data.top
      that.isLong = data.isLong
    }
    // alert(ipcRenderer.sendSync('test'))
  },
  methods: {
    openImg () {
      this.showImage(ipcRenderer.sendSync('open-image'))
    },
    initImg (image) {
      // 计算长宽比，初始化缩放图片
      const ratio = image.data.originWidth / image.data.originHeight
      const windowWidth = document.documentElement.clientWidth
      const windowHeight = document.documentElement.clientHeight

      let scale = 1
      let left = 0
      let top = 0
      let isLong = false
      if (ratio <= 0.4) {
        // 长图
        scale = (windowWidth * 0.6) / image.data.originWidth
        left = windowWidth * 0.2
        isLong = true
      } else {
        // 正常图片
        if (ratio >= windowWidth / windowHeight) {
          if (image.data.originWidth < windowWidth) {
            // 小图片不进行放大
            left = (windowWidth - image.data.originWidth) / 2
            top = (windowHeight - image.data.originHeight) / 2
          } else {
            // 大图片根据长边缩小
            scale = (windowWidth - 1) / image.data.originWidth
            top = (windowHeight - image.data.originHeight * scale) / 2
          }
        } else {
          if (image.data.originHeight < windowHeight) {
            // 小图片不进行放大
            left = (windowWidth - image.data.originWidth) / 2
            top = (windowHeight - image.data.originHeight) / 2
          } else {
            // 大图片根据宽边缩小
            scale = (windowHeight - 1) / image.data.originHeight
            left = (windowWidth - image.data.originWidth * scale) / 2
          }
        }
      }

      return { image: image, scale: scale, left: left, top: top, isLong: isLong }
    },
    preImg () {
      this.showImage(ipcRenderer.sendSync('pre-image'))
    },
    nextImg () {
      this.showImage(ipcRenderer.sendSync('next-image'))
    },
    dragImg (e) {
      this.left = this.originLeft + e.clientX - this.mouse.x
      this.top = this.originTop + e.clientY - this.mouse.y
    },
    scaleImg (isDown) {
      // 缩放
      let newScale
      if (isDown) {
        newScale = parseFloat((this.scale - 0.05).toFixed(2))
        // 缩放下限
        if (newScale < 0.01) {
          newScale = 0.01
        }
      } else {
        newScale = parseFloat((this.scale + 0.05).toFixed(2))
        // 缩放上限
        if (newScale > 5) {
          newScale = 5
        }
      }
      this.scaleTo(newScale)
    },
    rotateImg (isClockwise) {
      if (isClockwise) {
        this.rotate += 90
      } else {
        this.rotate -= 90
      }
    },
    deleteImg () {
      this.$confirm('此操作将永久删除该图片, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showImage(ipcRenderer.sendSync('delete-image'))
        this.$notify({
          title: '删除成功!',
          duration: 2000
        })
      }).catch(() => {})
    },
    scaleTo (newScale) {
      const deltaX = this.image.data.originWidth * newScale - this.width
      const deltaY = this.image.data.originHeight * newScale - this.height
      if (this.isHover) {
        this.left -= deltaX * (this.mouse.x - this.left) / this.width
        this.top -= deltaY * (this.mouse.y - this.top) / this.height
      } else {
        this.left -= deltaX / 2
        this.top -= deltaY / 2
      }
      this.scale = newScale
    },
    setDragging (bool) {
      this.isDragging = bool
    },
    setHover (bool) {
      this.isHover = bool
    },
    showImage (image) {
      if (image != null) {
        const that = this
        const img = new Image()
        img.src = image.data.url
        img.onload = function () {
          // TODO 初始化图片时取消缩放动画
          // 初始化图片
          const data = that.initImg(image)
          that.scale = data.scale
          that.left = data.left
          that.top = data.top
          that.isLong = data.isLong
          that.image = data.image
          that.isEmpty = false
          if (that.image.index === 0) {
            that.showMessage('你正在浏览第一张图片')
          } else if (that.image.index === that.image.total - 1) {
            that.showMessage('你正在浏览最后一张图片')
          }
        }
      } else {
        this.isEmpty = true
      }
    },
    showMessage (msg) {
      if (this.message != null) {
        this.message.close()
      }
      this.message = ElMessage({
        message: msg,
        center: true,
        duration: 1500,
        offset: 1
      })
    },
    openConfig () {
      ipcRenderer.send('open-config')
    },
    switchScrollMode (mode) {
      this.scrollMode = mode
    },
    glance (offset) {
      if ((offset < 0 && this.top >= -100) ||
        (offset > 0 && this.top <= -this.height + document.documentElement.clientHeight)) {
        return
      }
      this.top -= offset
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
