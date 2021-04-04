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
    :src="require('C:/Users/22364/OneDrive/桌面/Never Settle/' + 'Goat.jpg')"/>

  <transition name="fade">
    <div v-show="scaleInfo.showScale" class="scale-info">
      {{ animatedScale }}
    </div>
  </transition>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'Viewer',
  props: {
    msg: String
  },
  data () {
    return {
      isEmpty: true,
      isHover: false,
      isDragging: false,
      scaleInfo: {
        showScale: false,
        timer: null
      },
      // 系统
      mouse: {
        x: 0,
        y: 0
      },
      // 图片
      url: 'C:/Users/22364/OneDrive/桌面/Never Settle/Husky.jpg',
      scale: 1,
      originWidth: 1920,
      originHeight: 1080,
      left: 0,
      top: 0,
      originLeft: 0,
      originTop: 0,
      // 动画
      tweenScale: null,
      tweenWidth: null,
      tweenHeight: null,
      tweenLeft: null,
      tweenTop: null
    }
  },
  computed: {
    width: function () {
      return this.originWidth * this.scale
    },
    height: function () {
      return this.originHeight * this.scale
    },
    animatedScale: function () {
      return (this.tweenScale * 100).toFixed(0) + '%'
    }
  },
  watch: {
    scale (newValue) {
      if (this.tweenScale == null) {
        this.tweenScale = newValue
      } else {
        gsap.to(this.$data, { duration: 0.5, tweenScale: newValue })
      }
    },
    width (newValue) {
      if (this.tweenWidth == null) {
        this.tweenWidth = newValue
      } else {
        gsap.to(this.$data, { duration: 0.5, tweenWidth: newValue })
      }
    },
    height (newValue) {
      if (this.tweenHeight == null) {
        this.tweenHeight = newValue
      } else {
        gsap.to(this.$data, { duration: 0.5, tweenHeight: newValue })
      }
    },
    left (newValue) {
      if (this.tweenLeft == null) {
        this.tweenLeft = newValue
      } else {
        gsap.to(this.$data, { duration: 0.5, tweenLeft: newValue })
      }
    },
    top (newValue) {
      if (this.tweenTop == null) {
        this.tweenTop = newValue
      } else {
        gsap.to(this.$data, { duration: 0.5, tweenTop: newValue })
      }
    }
  },
  mounted () {
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
      }
    }
    window.onmousewheel = function (e) {
      if (!that.isEmpty) {
        that.scaleImg(e)
      }
    }
  },
  methods: {
    openImg () {
      // TODO 图片打开功能
      this.initImg()
      this.isEmpty = false
    },
    initImg () {
      // 初始化图片时取消缩放动画
      this.tweenScale = null
      this.tweenWidth = null
      this.tweenHeight = null
      this.tweenLeft = null
      this.tweenTop = null
      // 计算长宽比，初始化缩放图片
      const ratio = this.originWidth / this.originHeight
      const windowWidth = document.documentElement.clientWidth
      const windowHeight = document.documentElement.clientHeight

      if (ratio >= windowWidth / windowHeight) {
        // 小图片不进行放大
        if (this.originWidth < windowWidth) {
          return
        }
        // 大图片根据长边缩小
        this.scale = (windowWidth - 1) / this.originWidth
        this.left = 0
        this.top = (windowHeight - this.height) / 2
      } else {
        // 小图片不进行放大
        if (this.originHeight < windowHeight) {
          return
        }
        // 大图片根据宽边缩小
        this.scale = (windowHeight - 1) / this.originHeight
        this.top = 0
        this.left = (windowWidth - this.width) / 2
      }
    },
    dragImg (e) {
      this.left = this.originLeft + e.clientX - this.mouse.x
      this.top = this.originTop + e.clientY - this.mouse.y
    },
    scaleImg (e) {
      // 设置定时器
      this.setShowScale(true)
      clearTimeout(this.scaleInfo.timer)
      const that = this
      this.scaleInfo.timer = setTimeout(function () {
        that.setShowScale(false)
      }, 1200)
      // 缩放
      const isDown = e.deltaY > 0
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
      const deltaX = this.originWidth * newScale - this.width
      const deltaY = this.originHeight * newScale - this.height
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
    setShowScale (bool) {
      this.scaleInfo.showScale = bool
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease !important;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 0.6 !important;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
}

.scale-info {
  position: fixed;
  background: black;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  color: white;
  height: 40px;
  min-width: 120px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 1px;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  opacity: 0.6;
  /* 鼠标穿透 */
  pointer-events: none;
}

.material-shadow {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16);
}
</style>
