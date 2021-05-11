<template>
  <el-image
    :style="{
    'position':'absolute',
    'display':'block',
    'width':width+'px',
    'height':height+'px',
    'left':left+'px',
    'top':top+'px',
    'transform':'rotate('+rotate+'deg)',
    'box-shadow':shadowX+'px '+shadowY+'px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}"
    :draggable="false"
    v-on:mouseenter="setHover(true)"
    v-on:mouseleave="setHover(false)"
    :src="imageUrl" />

  <ScaleInfo
    v-if="config.common.interface.enableScaleInfo"
    :scale="scale" />
  <ChangePageBtn
    v-if="config.common.interface.enableChangePageBtn"
    @pre-image="preImage"
    @next-image="nextImage" />
  <BottomToolBar
    v-if="config.common.interface.enableBottomToolBar"
    :scale-prop="scale"
    :config="config"
    :image="image"
    @scale="scaleTo"
    @pre="preImage"
    @next="nextImage"
    @rotate="rotateImage"
    @delete="deleteImage"
    @config="$emit('config')"
    @fullscreen="$emit('fullscreen')"
    @comic="$emit('comic')"/>
</template>

<script>
import ScaleInfo from '@/view/viewer/components/ScaleInfo'
import ChangePageBtn from '@/view/viewer/components/ChangePageBtn'
import BottomToolBar from '@/view/viewer/components/BottomToolBar'

const TAG = '[Displayer]'

export default {
  name: 'Displayer',
  components: {
    ScaleInfo,
    ChangePageBtn,
    BottomToolBar
  },
  props: {
    config: Object,
    image: Object,
    mode: Object
  },
  emits: {
    resize: null,
    preImage: null,
    nxtImage: null,
    deleteImage: null,
    fullscreen: null,
    comic: null,
    config: null,
    message: null
  },
  data () {
    return {
      hover: false,
      dragging: false,
      scale: 0,
      left: 0,
      top: 0,
      rotate: 0,
      // 临时计算数据
      temp: {
        mouseX: 0,
        mouseY: 0,
        keyCtrl: false
      }
    }
  },
  computed: {
    imageUrl: function () {
      return this.image ? encodeURI(this.image.data.url) : ''
    },
    width: function () {
      return this.image ? this.image.data.width * this.scale + 1 : 0
    },
    height: function () {
      return this.image ? this.image.data.height * this.scale + 1 : 0
    },
    shadowX: function () {
      const sign = this.rotate >= 0 ? 1 : -1
      switch (this.rotate % 360) {
        default:
        case 0:
          return 0
        case 90:
          return sign * 3
        case 180:
          return 0
        case 270:
          return sign * -3
      }
    },
    shadowY: function () {
      const sign = this.rotate >= 0 ? 1 : -1
      switch (this.rotate % 360) {
        default:
        case 0:
          return sign * 3
        case 90:
          return 0
        case 180:
          return sign * -3
        case 270:
          return 0
      }
    }
  },
  watch: {
    image (newImage) {
      this.rotate = 0
      this.scale = newImage.attr.initScale
      this.left = newImage.attr.initLeft
      this.top = newImage.attr.initTop
    },
    'mode.comic' (newValue) {
      if (newValue) {
        this.removeListener()
      } else {
        this.addListener()
      }
    }
  },
  mounted () {
    this.addListener()
  },
  methods: {
    setHover (bool) {
      this.hover = bool
    },
    setDragging (bool) {
      this.dragging = bool
    },
    addListener () {
      window.addEventListener('mousedown', this.handleMouseDown)
      window.addEventListener('mouseup', this.handleMouseUp)
      window.addEventListener('mousemove', this.handleMove)
      window.addEventListener('mousewheel', this.handleWheel)
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
      window.addEventListener('resize', this.handleResize)
      console.log(TAG + 'addListener:监听已挂载')
    },
    removeListener () {
      window.removeEventListener('mousedown', this.handleMouseDown)
      window.removeEventListener('mouseup', this.handleMouseUp)
      window.removeEventListener('mousemove', this.handleMove)
      window.removeEventListener('mousewheel', this.handleWheel)
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
      window.removeEventListener('resize', this.handleResize)
      console.log(TAG + 'removeListener:监听已卸载')
    },
    /// ///
    handleMouseDown (event) {
      switch (event.button) {
        case 0:
          this.temp.mouseX = event.clientX
          this.temp.mouseY = event.clientY
          if (this.hover) {
            this.setDragging(true)
          }
          break
        case 1:
          this.$emit('fullscreen')
          break
      }
    },
    handleMouseUp (event) {
      this.setDragging(false)
    },
    handleMove (event) {
      if (this.dragging || this.hover) {
        if (this.dragging) {
          this.dragImage(event.clientX - this.temp.mouseX, event.clientY - this.temp.mouseY)
        }
        this.temp.mouseX = event.clientX
        this.temp.mouseY = event.clientY
      }
    },
    handleResize (event) {
      this.$emit('resize')
    },
    handleWheel (event) {
      if (this.temp.keyCtrl) {
        this.scaleImage(event.deltaY > 0)
      } else {
        if (this.image.attr.long) {
          this.skimImage(event.deltaY)
        } else {
          if (event.deltaY > 0) {
            this.nextImage()
          } else {
            this.preImage()
          }
        }
      }
    },
    handleKeyDown (event) {
      console.log(event.code)
      switch (event.code) {
        case 'ControlLeft':
          this.temp.keyCtrl = true
          break
        case 'ArrowLeft':
          this.preImage()
          break
        case 'ArrowRight':
          this.nextImage()
          break
        case 'ArrowUp':
          this.skimImage(-100)
          break
        case 'ArrowDown':
          this.skimImage(100)
          break
      }
    },
    handleKeyUp (event) {
      switch (event.code) {
        case 'ControlLeft':
          this.temp.keyCtrl = false
          break
      }
    },
    /// ///
    preImage () {
      this.$emit('preImage')
    },
    nextImage () {
      this.$emit('nxtImage')
    },
    deleteImage () {
      this.$confirm('此操作将永久删除该图片, 是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('deleteImage')
      }).catch(() => {})
    },
    /// ///
    dragImage (deltaX, deltaY) {
      this.left = this.left + deltaX
      this.top = this.top + deltaY
    },
    scaleImage (isDown) {
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
    rotateImage (isClockwise) {
      if (isClockwise) {
        this.rotate += 90
      } else {
        this.rotate -= 90
      }
    },
    skimImage (offset) {
      if ((offset < 0 && this.top >= 100) ||
        (offset > 0 && this.top <= -100 - this.height + document.documentElement.clientHeight)) {
        return
      }
      this.skimTo(this.top - offset)
    },
    /// ///
    scaleTo (newScale) {
      const deltaX = this.image.data.width * newScale - this.width
      const deltaY = this.image.data.height * newScale - this.height
      if (this.hover) {
        this.left -= deltaX * (this.temp.mouseX - this.left) / this.width
        this.top -= deltaY * (this.temp.mouseY - this.top) / this.height
      } else {
        this.left -= deltaX / 2
        this.top -= deltaY / 2
      }
      this.scale = newScale
    },
    skimTo (top) {
      this.top = top
    },
    showMessage (msg) {
      this.$emit('message', msg)
    }
  }
}
</script>

<style scoped>
</style>
