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
    'display':isEmpty?'none':'block',
    'transform':'rotate('+tweenRotate+'deg)',
    'box-shadow':tweenShadowH+'px '+tweenShadowV+'px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}"
    :draggable="false"
    v-on:mousedown="$parent.setDragging(true)"
    v-on:mouseenter="$parent.setHover(true)"
    v-on:mouseleave="$parent.setHover(false)"
    :src="url"/>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'ImageDisplay',
  props: {
    isEmpty: Boolean,
    url: String,
    width: Number,
    height: Number,
    left: Number,
    top: Number,
    rotate: Number
  },
  data () {
    return {
      // 动画
      tweenScale: 1,
      tweenWidth: 0,
      tweenHeight: 0,
      tweenLeft: 400,
      tweenTop: 300,
      tweenRotate: 0,
      tweenShadowH: 0,
      tweenShadowV: 3
    }
  },
  watch: {
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
    },
    rotate (newValue) {
      gsap.to(this.$data, { duration: 0.2, tweenRotate: newValue })
      const sign = newValue >= 0 ? 1 : -1
      switch (newValue % 360) {
        default:
        case 0:
          gsap.to(this.$data, { duration: 0.2, tweenShadowH: 0 })
          gsap.to(this.$data, { duration: 0.2, tweenShadowV: sign * 3 })
          break
        case 90:
          gsap.to(this.$data, { duration: 0.2, tweenShadowH: sign * 3 })
          gsap.to(this.$data, { duration: 0.2, tweenShadowV: 0 })
          break
        case 180:
          gsap.to(this.$data, { duration: 0.2, tweenShadowH: 0 })
          gsap.to(this.$data, { duration: 0.2, tweenShadowV: sign * -3 })
          break
        case 270:
          gsap.to(this.$data, { duration: 0.2, tweenShadowH: sign * -3 })
          gsap.to(this.$data, { duration: 0.2, tweenShadowV: 0 })
          break
      }
    }
  },
  methods: {
    openImg () {
      // TODO 打开本地文件
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
