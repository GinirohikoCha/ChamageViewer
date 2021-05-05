<template>
  <el-empty description="未选择图片" v-show="!display" class="empty">
    <el-button type="primary" v-on:click="openImg">打开图片</el-button>
  </el-empty>

  <ImageDisplay
    :display="display"
    :url="url"
    :width="width"
    :height="height"
    :left="left"
    :top="top"
    :rotate="rotate" />

  <ScaleInfo
    v-if="config.common.interface.enableScaleInfo"
    :scale="scale" />
  <ChangePageBtn
    v-if="config.common.interface.enableChangePageBtn && display"
    :show="show.changePageBtn"
    @pre-image="preImg"
    @next-image="nextImg" />
  <BottomToolBar
    v-if="config.common.interface.enableBottomToolBar"
    :toggle="show.toolbar"
    :scale-prop="scale"
    :config="config"
    @pre="preImg"
    @next="nextImg"
    @scale="scaleTo"
    @rotate="rotateImg"
    @delete="deleteImg" />
</template>

<script>
import ImageDisplay from '@/view/components/ImageDisplay'
import ScaleInfo from '@/view/components/ScaleInfo'
import BottomToolBar from '@/view/components/BottomToolBar'
import ChangePageBtn from '@/view/components/ChangePageBtn'

export default {
  name: 'Displayer',
  components: {
    ImageDisplay,
    ScaleInfo,
    BottomToolBar,
    ChangePageBtn
  },
  props: {
    config: Object,
    image: Object,
    initAttr: Object
  },
  emits: {
    openImage: null,
    preImage: null,
    nextImage: null,
    deleteImage: null,
    message: null
  },
  data () {
    return {
      display: false,
      url: '',
      // 系统操作状态
      isHover: false, // 是否悬浮在图片上方
      isDragging: false, // 是否正在拖拽图片
      mouse: {
        x: 0,
        y: 0
      },
      // 图片显示状态
      scale: 1,
      left: -1,
      top: -1,
      pressLeft: 0,
      pressTop: 0,
      rotate: 0,
      // 组件显隐
      show: {
        toolbar: false,
        changePageBtn: false
      }
    }
  },
  computed: {
    width: function () {
      return this.image.data.originWidth * this.scale
    },
    height: function () {
      return this.image.data.originHeight * this.scale
    }
  },
  watch: {
    image (newImage) {
      this.showImage()
    }
  },
  mounted () {
    // 初始化
    this.showImage()
    // 全局操作监听
    const that = this
    window.onmousedown = function (e) {
      if (that.display) {
        that.mouse.x = e.clientX
        that.mouse.y = e.clientY
        that.originLeft = that.left
        that.originTop = that.top
      }
    }
    window.onmouseup = function (e) {
      if (that.display) {
        that.setDragging(false)
      }
    }
    window.onmousemove = function (e) {
      if (that.display) {
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
      if (that.display && that.config.habit.scroll.enable) {
        switch (that.config.habit.scroll.mode) {
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
  },
  methods: {
    setHover (bool) {
      this.isHover = bool
    },
    setDragging (bool) {
      this.isDragging = bool
    },
    openImg () {
      this.$emit('openImage')
    },
    preImg () {
      this.$emit('preImage')
    },
    nextImg () {
      this.$emit('nextImage')
    },
    deleteImg () {
      this.$confirm('此操作将永久删除该图片, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('deleteImage')
      }).catch(() => {})
    },
    showImage () {
      if (this.image != null) {
        const that = this
        const img = new Image()
        img.src = that.image.data.url
        img.onload = function () {
          // TODO 初始化图片时取消缩放动画
          // 初始化图片
          that.scale = that.initAttr.scale
          that.left = that.initAttr.left
          that.top = that.initAttr.top
          that.url = that.image.data.url
          that.display = true
          if (that.image.index === 0) {
            that.showMessage('你正在浏览第一张图片')
          } else if (that.image.index === that.image.total - 1) {
            that.showMessage('你正在浏览最后一张图片')
          }
        }
      } else {
        this.display = false
      }
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
    /// /////////////////////////////////////////////
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
    glance (offset) {
      if ((offset < 0 && this.top >= -100) ||
        (offset > 0 && this.top <= -this.height + document.documentElement.clientHeight)) {
        return
      }
      this.top -= offset
    },
    showMessage (msg) {
      this.$emit('message', msg)
    }
  }
}
</script>

<style scoped>
.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
}
</style>
