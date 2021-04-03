<template>
  <el-empty description="未选择图片" v-show="isEmpty">
    <el-button type="primary" v-on:click="openImg">打开图片</el-button>
  </el-empty>

  <el-image
    :style="{
    'width':width+'px',
    'height':height+'px',
    'left':left+'px',
    'top':top+'px',
    'display':isEmpty?'none':'block'}"
    :draggable="false"
    v-on:mousedown="setDragging (true)"
    :src="url"/>

  <div id="scale">
    {{ animatedScale }}
  </div>
</template>

<script>
export default {
  name: 'Viewer',
  props: {
    msg: String
  },
  data () {
    return {
      isEmpty: true,
      isDragging: false,
      mouse: {
        x: 0,
        y: 0
      },
      url: 'https://www.bing.com/th?id=OHR.BrazilSandDunes_ZH-CN2924749051_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=HpEdgeAn',
      width: 0,
      height: 0,
      originWidth: 1920,
      originHeight: 1080,
      left: 0,
      top: 0,
      originLeft: 0,
      originTop: 0
    }
  },
  computed: {
    scale: function () {
      return this.width / this.originWidth
    },
    animatedScale: function () {
      return (this.scale * 100).toFixed(0) + '%'
    }
  },
  mounted () {
    const that = this
    window.onmousedown = function (e) {
      that.mouse.x = e.clientX
      that.mouse.y = e.clientY
      that.originLeft = that.left
      that.originTop = that.top
    }
    window.onmouseup = function (e) {
      that.setDragging(false)
    }
    window.onmousemove = function (e) {
      if (that.isDragging) {
        that.dragImg(e)
      }
    }
    window.onmousewheel = function (e) {
      that.scaleImg(e)
    }
  },
  methods: {
    openImg () {
      this.initImg()
      this.isEmpty = false
    },
    initImg () {
      const ratio = this.originWidth / this.originHeight
      const windowWidth = document.documentElement.clientWidth
      const windowHeight = document.documentElement.clientHeight
      if (ratio >= windowWidth / windowHeight) {
        // 小图片不进行放大
        if (this.originWidth < windowWidth) {
          this.width = this.originWidth
          this.height = this.originHeight
          return
        }
        // 大图片根据长边缩小
        this.width = windowWidth - 1
        this.height = windowWidth / ratio
        this.left = 0
        this.top = (windowHeight - this.height) / 2
      } else {
        // 小图片不进行放大
        if (this.originHeight < windowHeight) {
          this.width = this.originWidth
          this.height = this.originHeight
          return
        }
        // 大图片根据宽边缩小
        this.height = windowHeight - 1
        this.width = windowHeight * ratio
        this.top = 0
        this.left = (windowWidth - this.width) / 2
      }
    },
    dragImg (e) {
      this.left = this.originLeft + e.clientX - this.mouse.x
      this.top = this.originTop + e.clientY - this.mouse.y
    },
    scaleImg (e) {
      const isDown = e.deltaY > 0
      // TODO 鼠标在图片上时，锚定鼠标位置
      // const mouseX = e.clientX
      // const mouseY = e.clientY
      let newScale
      if (isDown) {
        newScale = (this.scale - 0.05).toFixed(2)
      } else {
        newScale = (this.scale + 0.05).toFixed(2)
      }
      const deltaX = this.originWidth * newScale - this.width
      const deltaY = this.originHeight * newScale - this.height
      this.left -= deltaX / 2
      this.top -= deltaY / 2
      this.width += deltaX
      this.height += deltaY
    },
    setDragging (bool) {
      this.isDragging = bool
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#scale {
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
</style>
