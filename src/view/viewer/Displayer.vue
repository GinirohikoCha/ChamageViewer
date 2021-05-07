<template>
  <el-image
    :style="{
    'width':width+'px',
    'height':height+'px',
    'left':left+'px',
    'top':top+'px',
    'box-shadow':'0px 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}"
    :draggable="false"
    v-on:mouseenter="setHover(true)"
    v-on:mouseleave="setHover(false)"
    :src="imageUrl"/>
</template>

<script>
export default {
  name: 'Displayer',
  props: {
    image: Object
  },
  emits: {
    resize: null,
    preImage: null,
    nxtImage: null
  },
  data () {
    return {
      hover: false,
      dragging: false,
      scale: 0,
      left: 0,
      top: 0,
      // 临时计算数据
      temp: {
        mouseX: 0,
        mouseY: 0
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
      // TODO 根据区域显隐按钮
    },
    handleInit (event) {
      this.$emit('resize')
    },
    handleWheel (event) {
      if (event.deltaY > 0) {
        this.nextImg()
      } else {
        this.preImg()
      }
    },
    /// ///
    preImg () {
      this.$emit('preImage')
    },
    nextImg () {
      this.$emit('nxtImage')
    },
    /// ///
    dragImage (deltaX, deltaY) {
      this.left = this.left + deltaX
      this.top = this.top + deltaY
    }
  }
}
</script>

<style scoped>
</style>
