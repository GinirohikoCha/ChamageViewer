<template>
  <el-image
    :style="{
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
    :src="imageUrl"/>

  <ScaleInfo :scale="scale" />
  <ChangePageBtn
    @pre-image="preImage"
    @next-image="nextImage"/>
  <BottomToolBar
    :scale-prop="scale"
    :config="config"
    :image="image"
    :status="{ scrollMode: 0, comicMode: false }"
    @scale="scaleTo"
    @pre="preImage"
    @next="nextImage"
    @rotate="rotateImage"
    @delete="deleteImage"/>
</template>

<script>
import ScaleInfo from '@/view/viewer/components/ScaleInfo'
import ChangePageBtn from '@/view/viewer/components/ChangePageBtn'
import BottomToolBar from '@/view/viewer/components/BottomToolBar'

export default {
  name: 'Displayer',
  components: {
    ScaleInfo,
    ChangePageBtn,
    BottomToolBar
  },
  props: {
    config: Object,
    image: Object
  },
  emits: {
    resize: null,
    preImage: null,
    nxtImage: null,
    deleteImage: null
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
      return this.image ? this.image.data.url : ''
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
      this.scale = newImage.attr.initScale
      this.left = newImage.attr.initLeft
      this.top = newImage.attr.initTop
    }
  },
  mounted () {
    const that = this
    window.onmousedown = function (e) {
      that.handlePress(e)
    }
    window.onmouseup = function (e) {
      that.handleRelease(e)
    }
    window.onmousemove = function (e) {
      that.handleMove(e)
    }
    window.onresize = function (e) {
      that.handleInit(e)
    }
    window.onmousewheel = function (e) {
      that.handleWheel(e)
    }
    window.onkeydown = function (e) {
      that.handleKeyDwn(e)
    }
    window.onkeyup = function (e) {
      that.handleKeyUp(e)
    }
  },
  methods: {
    setHover (bool) {
      this.hover = bool
    },
    setDragging (bool) {
      this.dragging = bool
    },
    /// ///
    handlePress (event) {
      this.temp.mouseX = event.clientX
      this.temp.mouseY = event.clientY
      if (this.hover) {
        this.setDragging(true)
      }
    },
    handleRelease (event) {
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
    handleInit (event) {
      this.$emit('resize')
    },
    handleWheel (event) {
      if (this.temp.keyCtrl) {
        this.scaleImage(event.deltaY > 0)
      } else {
        if (event.deltaY > 0) {
          this.nextImage()
        } else {
          this.preImage()
        }
      }
    },
    handleKeyDwn (event) {
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
          break
        case 'ArrowDown':
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
      this.$confirm('此操作将永久删除该图片, 是否确定?', '提示', {
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
    }
  }
}
</script>

<style scoped>
</style>
