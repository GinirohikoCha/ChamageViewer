<template>
  <div
    :style="{
    'width':width+'px',
    'height':'auto',
    'left':tweenLeft+'px',
    'top':tweenTop+'px',
    'display':display?'block':'none',
    'box-shadow':'0px 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}">
    <el-image class="comic-image" v-for="url in urls" :key="url" :src="url" :draggable="false" lazy />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'ComicDisplay',
  props: {
    display: Boolean,
    imageList: Object,
    width: Number,
    left: Number,
    top: Number
  },
  data () {
    return {
      // 动画
      tweenLeft: 400,
      tweenTop: 300
    }
  },
  computed: {
    urls: function () {
      const images = []
      if (this.imageList != null) {
        for (let i = 0; i < this.imageList.images.length; i++) {
          images.push(this.imageList.dir + this.imageList.images[i])
        }
      }
      return images
    }
  },
  watch: {
    left (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenLeft: newValue })
    },
    top (newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenTop: newValue })
    },
    urls (newValue) {
      console.log(this.urls)
    }
  }
}
</script>

<style scoped>
.comic-image {
  position: relative;
}
</style>
