<template>
  <div
    ref="comicWrapper"
    :style="{
    'position':'absolute',
    'width':width+'px',
    'left':left+'px',
    'top':tweenTop+'px',
    'box-shadow':'0px 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}">
    <el-image
      :style="{
      'float':'left',
      'width':width+'px'}"
      :draggable="false"
      v-for="item in images"
      :key="item"
      :src="encodeURI(item.data.url)"/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { gsap } from 'gsap'
import { Listener } from '@/views/comic-viewer/module/listener'

export default {
  name: 'ComicViewer',
  data () {
    return {
      windowWidth: window.innerWidth,
      scale: 0.6,
      top: 50,
      tweenTop: 0,
      images: []
    }
  },
  computed: {
    width: function () {
      return this.windowWidth * this.scale
    },
    left: function () {
      return (this.windowWidth - this.width) / 2
    }
  },
  watch: {
    top (newValue) {
      gsap.to(this.$data, { duration: 0.3, tweenTop: newValue })
    }
  },
  mounted () {
    // 获取数据
    console.info('[comic-viewer]正在加载漫画')
    const data = ipcRenderer.sendSync('load-images')
    this.images = data.images
    // 事件监听
    this.listener = new Listener(
      this.onResize,
      this.onWheel,
      this.onKeyDown,
      this.onKeyUp
    )
    this.listener.register()
  },
  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
    },
    onWheel (event, keyCtrl) {
      if (keyCtrl) {
        this.scaleComic(event.deltaY > 0)
      } else {
        this.skim(event.deltaY)
      }
    },
    onKeyDown (keyCode) {
      switch (keyCode) {
        case 'ArrowLeft':
          this.skim(-window.innerHeight)
          break
        case 'ArrowRight':
          this.skim(window.innerHeight)
          break
        case 'ArrowUp':
          this.skim(-100)
          break
        case 'ArrowDown':
          this.skim(100)
          break
        case 'Escape':
          this.$router.push('/')
          // TODO 禁用路由缓存
          break
      }
    },
    onKeyUp (event) {},
    /// ///
    scaleComic (isDown) {
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
    skim (offset) {
      if ((offset < 0 && this.top >= 50) ||
        (offset > 0 && this.top <= -50 - this.$refs.comicWrapper.offsetHeight + document.documentElement.clientHeight)) {
        return
      }
      this.skimTo(this.top - offset)
    },
    skimTo (top) {
      this.top = top
    }
  }
}
</script>

<style scoped>
</style>
