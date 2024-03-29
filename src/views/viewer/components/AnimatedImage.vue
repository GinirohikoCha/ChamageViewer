<template>
  <el-image
    :src="encodeURI(url)"
    :style="{
    'display':'block',
    'width':tweenWidth+'px',
    'height':tweenHeight+'px',
    'left':tweenLeft+'px',
    'top':tweenTop+'px',
    'transform':'rotate('+tweenRotate+'deg)',
    'box-shadow':tweenShadowH+'px '+tweenShadowV+'px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}"
    :draggable="false"
    v-on:mouseenter="$emit('enter')"
    v-on:mouseleave="$emit('leave')">
    <template #error>
      <div class="image-slot">
        加载中...
      </div>
    </template>
  </el-image>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'ImageDisplay',
  props: {
    config: Object,
    url: String,
    width: Number,
    height: Number,
    left: Number,
    top: Number,
    rotate: Number
  },
  emits: {
    enter: null,
    leave: null
  },
  data () {
    return {
      // 动画
      tweenWidth: 0,
      tweenHeight: 0,
      tweenLeft: 0,
      tweenTop: 0,
      tweenRotate: 0,
      tweenShadowH: 0,
      tweenShadowV: 3,
      animation: {
        width: null,
        height: null,
        left: null,
        top: null,
        rotate: null
      }
    }
  },
  watch: {
    url (newValue) {
      // 切换图片初始化时禁止动画
      if (this.animation.width) {
        this.animation.width.kill()
      }
      if (this.animation.height) {
        this.animation.height.kill()
      }
      if (this.animation.left) {
        this.animation.left.kill()
      }
      if (this.animation.top) {
        this.animation.top.kill()
      }
      if (this.animation.rotate) {
        this.animation.rotate.kill()
      }
      gsap.set(this.$data, {
        tweenWidth: this.width,
        tweenHeight: this.height,
        tweenLeft: this.left,
        tweenTop: this.top,
        tweenRotate: this.rotate
      })
    },
    width (newValue) {
      this.animation.width = gsap.to(this.$data, { duration: 0.3, tweenWidth: newValue })
    },
    height (newValue) {
      this.animation.height = gsap.to(this.$data, { duration: 0.3, tweenHeight: newValue })
    },
    left (newValue) {
      if (this.config.common.animation.move) {
        this.animation.left = gsap.to(this.$data, { duration: 0.3, tweenLeft: newValue })
      } else {
        this.tweenLeft = newValue
      }
    },
    top (newValue) {
      if (this.config.common.animation.move) {
        this.animation.top = gsap.to(this.$data, { duration: 0.3, tweenTop: newValue })
      } else {
        this.tweenTop = newValue
      }
    },
    rotate (newValue) {
      this.animation.rotate = gsap.to(this.$data, { duration: 0.3, tweenRotate: newValue })
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
  }
}
</script>

<style scoped>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>
