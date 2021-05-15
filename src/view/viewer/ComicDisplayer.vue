<template>
  <div
    ref="comicWrapper"
    :style="{
    'position':'absolute',
    'width':width+'px',
    'left':left+'px',
    'top':top+'px',
    'box-shadow':'0px 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}">
    <el-image
      :style="{
      'float':'left',
      'width':width+'px'}"
      v-for="url in imageUrls"
      :draggable="false"
      :key="url"
      :src="url"/>
  </div>
</template>

<script>

const TAG = '[ComicDisplayer]'

export default {
  name: 'ComicDisplayer',
  props: {
    imageList: Object,
    mode: Object
  },
  emits: {
    escape: null,
    fullscreen: null
  },
  data () {
    return {
      windowWidth: document.documentElement.clientWidth,
      scale: 0.6,
      top: 50,
      // 临时计算数据
      temp: {
        keyCtrl: false
      }
    }
  },
  computed: {
    width: function () {
      return this.windowWidth * this.scale
    },
    left: function () {
      return (this.windowWidth - this.width) / 2
    },
    imageUrls: function () {
      console.log(TAG + 'imageUrls:正在渲染漫画')
      const imageList = this.imageList
      const urls = []
      imageList.images.forEach(function (item, index) {
        if (item.name) {
          urls.push(encodeURI(item.data.url))
        } else {
          urls.push(encodeURI(imageList.dir + item))
        }
      })
      return urls
    }
  },
  mounted () {
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousewheel', this.handleWheel)
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    console.log(TAG + 'mounted:监听已挂载')
  },
  unmounted () {
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousewheel', this.handleWheel)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    console.log(TAG + 'unmounted:监听已卸载')
  },
  methods: {
    handleMouseDown (event) {
      switch (event.button) {
        case 1:
          event.preventDefault()
          this.$emit('fullscreen')
          break
      }
    },
    handleWheel (event) {
      if (this.temp.keyCtrl) {
        this.scaleImage(event.deltaY > 0)
      } else {
        this.skimImage(event.deltaY)
      }
    },
    handleResize (event) {
      this.windowWidth = document.documentElement.clientWidth
    },
    handleKeyDown (event) {
      console.log(event.code)
      switch (event.code) {
        case 'ControlLeft':
          this.temp.keyCtrl = true
          break
        case 'ArrowLeft':
          break
        case 'ArrowRight':
          break
        case 'ArrowUp':
          this.skimImage(-100)
          break
        case 'ArrowDown':
          this.skimImage(100)
          break
        case 'Escape':
          this.$emit('escape')
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
    scaleImage (isDown) {
      // 缩放
      let newScale
      if (isDown) {
        newScale = parseFloat((this.scale - 0.05).toFixed(2))
        // 缩放下限
        if (newScale < 0.05) {
          newScale = 0.05
        }
      } else {
        newScale = parseFloat((this.scale + 0.05).toFixed(2))
        // 缩放上限
        if (newScale > 1) {
          newScale = 1
        }
      }
      this.scale = newScale
    },
    skimImage (offset) {
      if ((offset < 0 && this.top >= 50) ||
        (offset > 0 && this.top <= -50 - this.$refs.comicWrapper.offsetHeight + document.documentElement.clientHeight)) {
        return
      }
      this.skimTo(this.top - offset)
    },
    /// ///
    skimTo (top) {
      this.top = top
    }
  }
}
</script>

<style scoped>
</style>
