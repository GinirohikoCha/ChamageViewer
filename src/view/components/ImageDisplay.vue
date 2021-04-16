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
    'transform':'rotate('+tweenRotate+'deg)'}"
    :draggable="false"
    class="material-shadow"
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
      tweenRotate: 0
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
      gsap.to(this.$data, { duration: 0.1, tweenRotate: newValue })
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
.material-shadow {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16);
}
</style>
