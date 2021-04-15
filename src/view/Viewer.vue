<template>
  <el-empty description="未选择图片" v-show="isEmpty" class="empty">
    <el-button type="primary" v-on:click="openImg">打开图片</el-button>
  </el-empty>

  <el-image
    :style="{
    'width':tweenWidth+'px',
    'height':tweenHeight+'px',
    'left':tweenLeft+'px',
    'top':tweenTop+'px',
    'display':isEmpty?'none':'block'}"
    :draggable="false"
    class="material-shadow"
    v-on:mousedown="setDragging (true)"
    v-on:mouseenter="setHover(true)"
    v-on:mouseleave="setHover(false)"
    :src="image.data.url"/>

  <ScaleInfo :change="scale" :scale="animatedScale" />
  <BottomToolBar :toggle="toolbar" :scaleProp="scale" :config="config"/>
</template>

<script>
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import { gsap } from 'gsap'
import ScaleInfo from '@/view/components/ScaleInfo'
import BottomToolBar from '@/view/components/BottomToolBar'

export default {
  name: 'Viewer',
  components: {
    ScaleInfo,
    BottomToolBar
  },
  data () {
    return {
      config: {
        scrollMode: 0 // 0:缩放-1:换页
      },
      // 系统
      isEmpty: true,
      isHover: false,
      isDragging: false,
      mouse: {
        x: 0,
        y: 0
      },
      // 图片
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
      left: 0,
      top: 0,
      originLeft: 0,
      originTop: 0,
      scale: 1,
      // 提示区
      toolbar: false,
      // 消息提示框
      message: null,
      // 动画
      tweenScale: 1,
      tweenWidth: 0,
      tweenHeight: 0,
      tweenLeft: 400,
      tweenTop: 300
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
  watch: {
    scale (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenScale: newValue })
    },
    width (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenWidth: newValue })
    },
    height (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenHeight: newValue })
    },
    left (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenLeft: newValue })
    },
    top (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenTop: newValue })
    }
  },
  mounted () {
    // 初始化
    this.showImage(ipcRenderer.sendSync('init-image'))
    // 全局操作监听
    const that = this
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
        // 是否在工具栏区域
        that.toolbar = document.documentElement.clientHeight - e.clientY <= 45
      }
    }
    window.onmousewheel = function (e) {
      if (!that.isEmpty) {
        switch (that.config.scrollMode) {
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
        }
      }
    }
    window.onkeydown = function (e) {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        that.preImg()
      }
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        that.nextImg()
      }
    }
    // this.showMessage(ipcRenderer.sendSync('test'))
  },
  methods: {
    openImg () {
      // TODO 打开本地文件
    },
    initImg (image) {
      // 计算长宽比，初始化缩放图片
      const ratio = image.data.originWidth / image.data.originHeight
      const windowWidth = document.documentElement.clientWidth
      const windowHeight = document.documentElement.clientHeight - 20

      if (ratio >= windowWidth / windowHeight) {
        if (image.data.originWidth < windowWidth) {
          // 小图片不进行放大
          this.scale = 1
          this.left = (windowWidth - image.data.originWidth) / 2
          this.top = (windowHeight - image.data.originHeight) / 2
        } else {
          // 大图片根据长边缩小
          this.scale = (windowWidth - 1) / image.data.originWidth
          this.left = 0
          this.top = (windowHeight - image.data.originHeight * this.scale) / 2
        }
      } else {
        if (image.data.originHeight < windowHeight) {
          // 小图片不进行放大
          this.scale = 1
          this.left = (windowWidth - image.data.originWidth) / 2
          this.top = (windowHeight - image.data.originHeight) / 2
        } else {
          // 大图片根据宽边缩小
          this.scale = (windowHeight - 1) / image.data.originHeight
          this.top = 0
          this.left = (windowWidth - image.data.originWidth * this.scale) / 2
        }
      }

      return image
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
      // TODO 缩放过程中切换会导致缩放数值不正常
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
          that.image = that.initImg(image)
          that.isEmpty = false
          if (that.image.index === 0) {
            that.showMessage('你正在浏览第一张图片')
          } else if (that.image.index === that.image.total - 1) {
            that.showMessage('你正在浏览最后一张图片')
          }
        }
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
    updateConfig (config) {
      this.config = config
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
}

.material-shadow {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16);
}
</style>
