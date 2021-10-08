<template>
  <div class="viewer-wrapper">
    <animated-image
      :url="temp.data.url"
      :width="temp.attr.scale * temp.data.width"
      :height="temp.attr.scale * temp.data.height"
      :left="temp.attr.left"
      :top="temp.attr.top"
      :rotate="temp.attr.rotate"
      @enter="listener.setHover(true)"
      @leave="listener.setHover(false)"/>
  </div>

  <scale-info :scale="temp.attr.scale"/>
</template>

<script>
import { ipcRenderer } from 'electron'
import AnimatedImage from '@/views/viewer/components/AnimatedImage'
import ScaleInfo from '@/views/viewer/components/ScaleInfo'
import { Listener } from '@/views/viewer/module/listener'
import { Display } from '@/views/viewer/module/display'

export default {
  name: 'Viewer',
  components: {
    AnimatedImage,
    ScaleInfo
  },
  data () {
    return {
      temp: {
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
      },
      images: [],
      display: null,
      listener: null
    }
  },
  mounted () {
    // 初始化
    // 获取数据
    console.info('[viewer]加载图片列表')
    const data = ipcRenderer.sendSync('load-images')
    this.images = data.images
    this.display = new Display(data.index, this.images)
    console.info('[viewer]初始化图片')
    this.temp = this.display.init()
    // 事件监听
    this.listener = new Listener(
      this.onResize,
      this.onWheel,
      this.onMouseDown,
      this.onMouseUp,
      this.onMouseMove,
      this.onKeyDown,
      this.onKeyUp
    )
    this.listener.register()
    // 通信监听
    // 其他组件触发事件通知调用
    ipcRenderer.on('viewer', (e, msg) => {
      switch (msg.event) {
        case 'pre':
          this.temp = this.display.turn(false)
          break
        case 'next':
          this.temp = this.display.turn(true)
          break
        case 'scale':
          this.display.scaleTo(1)
          break
        case 'scaleUp':
          this.display.scale(0.1)
          break
        case 'scaleDown':
          this.display.scale(-0.1)
          break
        case 'rotateL':
          this.display.rotate(false)
          break
        case 'rotateR':
          this.display.rotate(true)
          break
        case 'reload':
          this.images = msg.data.images
          this.display = new Display(msg.data.index, this.images)
          this.temp = this.display.init()
          break
      }
    })
  },
  unmounted () {
    this.listener.unRegister()
  },
  methods: {
    onResize (event) {
      this.display.init()
    },
    onWheel (event, mouse) {
      if (this.listener.getKeyCtrl()) {
        this.display.scale(event.deltaY > 0 ? -0.1 : 0.1, mouse)
      } else {
        this.temp = this.display.turn(event.deltaY > 0)
      }
    },
    onMouseDown () {},
    onMouseUp () {},
    onMouseMove (deltaX, deltaY) {
      this.display.move(deltaX, deltaY)
    },
    onKeyDown (keyCode) {
      switch (keyCode) {
        case 'ArrowUp':
        case 'ArrowLeft':
          this.temp = this.display.turn(false)
          break
        case 'ArrowDown':
        case 'ArrowRight':
          this.temp = this.display.turn(true)
          break
      }
    },
    onKeyUp (keyCode) {
    }
  }
}
</script>

<style scoped>
.viewer-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
